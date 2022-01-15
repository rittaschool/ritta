import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
    AuthResolver,
  ],
})
export class AuthModule {}
