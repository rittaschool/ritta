import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Challenge, IErrorType, RittaError } from '@rittaschool/shared';
import { Client, Repository } from 'redis-om';
import schema, { ChallengeRepository } from './challenge.entity';

@Injectable()
export class ChallengeService {
  client: Client;
  repository: ChallengeRepository;

  constructor(
    @Inject('LOGGER') private logger: Logger,
    private configService: ConfigService,
  ) {
    this.client = new Client();
  }

  async init() {
    await this.connect();
    this.repository = this.client.fetchRepository(schema);

    await this.createIndex();
  }

  private async createIndex() {
    try {
      await this.repository.createIndex();
    } catch (error) {}
  }

  private async connect() {
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
    const chal = this.repository.createEntity();

    chal.id = challenge.id;
    chal.type = challenge.type;
    chal.userId = challenge.userId;

    let id: string;

    try {
      id = await this.repository.save(chal);
      const expirySet = await this.handleExpire(id, 'Challenge', 5 * 60); // 5 minutes

      if (!expirySet) {
        this.logger.error({
          context: 'ChallengeDatabase',
          message: 'Could not set expiry for challenge with id ' + challenge.id,
        });
        await this.repository.remove(id);
      }
    } catch (error) {
      this.logger.error(error, error.stack, { context: 'ChallengeDatabase' });
    }

    return {
      id,
      storedChallenge: chal,
    };
  }

  async getChallenge(id: string): Promise<Challenge> {
    let challenges: Challenge[];

    try {
      challenges = await this.repository
        .search()
        .where('id')
        .equals(id)
        .returnAll();
    } catch (error) {
      throw new RittaError(
        'Challenge not found!',
        IErrorType.INVALID_CODE, //TODO: CHALLENGE_NOT_FOUND
      );
    }

    return challenges[0];
  }

  async handleExpire(
    key: string,
    type: string,
    ttlInSeconds: number,
  ): Promise<boolean> {
    const chal = await this.repository.fetch(key);

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
