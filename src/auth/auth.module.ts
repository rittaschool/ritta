import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { Oauth2Service } from './oauth2/oauth2.service';
import { OpinsysOauth } from './oauth2/opinsys.provider';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [JwtModule.register({}), UsersModule, UtilsModule],
  controllers: [AuthController],
  providers: [AuthService, Oauth2Service, OpinsysOauth],
})
export class AuthModule {}
