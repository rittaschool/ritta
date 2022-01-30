import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Challenge } from '@rittaschool/shared';
import { Client, Repository } from 'redis-om';
import schema from './challenge.entity';

@Injectable()
export class ChallengeService {
  client: Client;

  constructor(
    @Inject('LOGGER') private logger: Logger,
    private configService: ConfigService,
  ) {
    this.client = new Client();
  }

  async init() {
    if (this.client.isOpen()) return;

    try {
      await this.client.open(this.configService.get('REDIS_URI'));
      this.logger.log({
        context: 'ChallengeDatabase',
        message: 'Connected to Redis',
      });
    } catch (error) {
      this.logger.error({ context: 'ChallengeDatabase', message: error });
    }
  }

  async storeChallenge(
    challenge: Challenge,
  ): Promise<{ id: string; storedChallenge: Challenge }> {
    const repository = new Repository(schema, this.client);

    const chal = repository.createEntity();

    chal.id = challenge.id;
    chal.type = challenge.type;
    chal.userId = challenge.userId;

    let id: string;

    try {
      id = await repository.save(chal);
      const expirySet = await this.handleExpire(id, 'Challenge', 5 * 60); // 5 minutes

      if (!expirySet) {
        this.logger.error({
          context: 'ChallengeDatabase',
          message: 'Could not set expiry for challenge with id ' + challenge.id,
        });
        await repository.remove(id);
      }
    } catch (error) {
      this.logger.error(error, error.stack, { context: 'ChallengeDatabase' });
    }

    return {
      id,
      storedChallenge: chal,
    };
  }

  async handleExpire(
    key: string,
    type: string,
    ttlInSeconds: number,
  ): Promise<boolean> {
    const repository = new Repository(schema, this.client);
    const chal = await repository.fetch(key);

    if (!chal) return;

    const expiryDate = Math.floor(
      new Date(Date.now() + ttlInSeconds * 1000).getTime() / 1000,
    );

    // Add TTL (time to live)
    const res = await this.client.execute([
      'EXPIREAT',
      type + ':' + key,
      expiryDate,
    ]);

    if (res == 1) {
      return true;
    } else {
      return false;
    }
  }
}
