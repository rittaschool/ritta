import { Controller, Inject, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  IEventType,
  LoginOAuthUserDto,
  LoginOAuthValidationSchema,
  Challenge,
  IOtpChallengeData,
} from '@rittaschool/shared';
import { AuthService } from './auth.service';
import { JoiValidationPipe } from '../validation/joi.pipe';

@Controller()
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {}

  //@UsePipes(new JoiValidationPipe(LoginValidationSchema)) //TODO: make new schema
  @MessagePattern('user_login_password') //TODO: use the one from IEventType when new shared release
  async loginWithPassword(@Payload() challenge: Challenge) {
    const { data, userId } = challenge;

    return await this.authService.loginWithPassword(data, userId);
  }

  // TODO: add validation schema
  @MessagePattern('user_login_otp')
  submitOtpCode(@Payload() challenge: Challenge) {
    const { data, userId } = challenge;

    return this.authService.submitOtpCode(data as IOtpChallengeData, userId);
  }

  @UsePipes(new JoiValidationPipe(LoginOAuthValidationSchema))
  @MessagePattern(IEventType.USER_OAUTH_LOGIN)
  loginOAuth(loginOauthUserDto: LoginOAuthUserDto) {
    return this.authService.loginOAuth(loginOauthUserDto);
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
