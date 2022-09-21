import { Module } from '@nestjs/common';
import { Tokenizer } from '../validation/tokenizer';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  providers: [
    {
      provide: 'USERS_RESOLVER',
      useClass: UsersResolver,
    },
    {
      provide: 'USERS_SERVICE',
      useClass: UsersService,
    },
    {
      provide: 'TOKENIZER',
      useClass: Tokenizer,
    },
  ],
  exports: ['USERS_SERVICE'],
})
export class UsersModule {}
