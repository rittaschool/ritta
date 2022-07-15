import { Module } from '@nestjs/common';
import { UserService } from './user.service';

@Module({
  imports: [],
  providers: [
    {
      provide: 'USERS_SERVICE',
      useClass: UserService,
    },
  ],
  exports: ['USERS_SERVICE'],
})
export class ServicesModule {}
