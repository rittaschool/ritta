import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChallengeService } from './challenge.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'CHALLENGE_SERVICE',
      useClass: ChallengeService,
    },
  ],
  exports: ['CHALLENGE_SERVICE'],
})
export class ChallengeModule {}
