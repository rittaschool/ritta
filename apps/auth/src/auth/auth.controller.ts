import { Controller, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  IEventType,
  LoginValidationSchema,
  LoginUserDto,
  LoginOAuthUserDto,
  LoginMFAUserDto,
  LoginOAuthValidationSchema,
  LoginMFAValidationSchema,
} from '@rittaschool/shared';
import { AuthService } from './auth.service';
import { JoiValidationPipe } from '../validation/joi.pipe';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new JoiValidationPipe(LoginValidationSchema))
  @MessagePattern(IEventType.USER_LOGIN)
  login(@Payload() loginUserDto: LoginUserDto) {
    console.log('got it');
    return this.authService.login(loginUserDto);
  }

  @UsePipes(new JoiValidationPipe(LoginOAuthValidationSchema))
  @MessagePattern(IEventType.USER_OAUTH_LOGIN)
  loginOAuth(loginOauthUserDto: LoginOAuthUserDto) {
    return this.authService.loginOAuth(loginOauthUserDto);
  }

  @UsePipes(new JoiValidationPipe(LoginMFAValidationSchema))
  @MessagePattern(IEventType.USER_MFA_LOGIN)
  loginMFA(loginMFAUserDto: LoginMFAUserDto) {
    return this.authService.loginMFA(loginMFAUserDto);
  }
}
