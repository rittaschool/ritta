import { Module } from '@nestjs/common';
import { CommonModule } from 'framework';
import { UserService } from './user.service';

@Module({
  imports: [CommonModule],
  providers: [
    {
      provide: 'USERS_SERVICE',
      useClass: UserService,
    },
  ],
  exports: ['USERS_SERVICE'],
})
export class ServicesModule {}
