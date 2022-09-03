import { Controller, Inject, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import {
  Challenge,
  IEventType,
  LoginOAuthUserDto,
  LoginOAuthValidationSchema,
} from '@rittaschool/shared';
import { JoiValidationPipe } from '../validation/joi.pipe';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {}

  //@UsePipes(new JoiValidationPipe(LoginValidationSchema)) //TODO: make new schema
  @MessagePattern('user_login_password') //TODO: use the one from IEventType when new shared release
  async loginWithPassword(@Payload() challenge: Challenge) {
    const { data, userId } = challenge;

    try {
      return await this.authService.loginWithPassword(
        data.passwordData.password,
        userId,
      );
    } catch (e) {
      throw new RpcException(e.message);
    }
  }

  // TODO: add validation schema
  @MessagePattern('user_login_otp')
  async submitOtpCode(@Payload() challenge: Challenge) {
    const { data, userId } = challenge;
    try {
      return await this.authService.submitOtpCode(data.otpData.otp, userId);
    } catch (e) {
      throw new RpcException(e.message);
    }
  }

  @UsePipes(new JoiValidationPipe(LoginOAuthValidationSchema))
  @MessagePattern(IEventType.USER_OAUTH_LOGIN)
  async loginOAuth(loginOauthUserDto: LoginOAuthUserDto) {
    try {
      return await this.authService.loginOAuth(loginOauthUserDto);
    } catch (e) {
      throw new RpcException(e.message);
    }
  }

  // @UsePipes(new JoiValidationPipe(LoginMFAValidationSchema))
  // @MessagePattern(IEventType.USER_MFA_LOGIN)
  // loginMFA(loginMFAUserDto: LoginMFAUserDto) {
  //   return this.authService.loginMFA(loginMFAUserDto);
  // }

  @MessagePattern(IEventType.STATUS)
  async status() {
    return {
      status: 'ok',
    };
  }
}
