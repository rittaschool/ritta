import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
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
  ],
  controllers: [UsersController],
  exports: ['USERS_SERVICE'],
})
export class UsersModule {}
