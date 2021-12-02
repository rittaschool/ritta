import { Controller, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  IEventType,
  CreateUserValidationSchema,
  LoginUserDto,
  LoginOAuthUserDto,
  LoginMFAUserDto,
} from '@rittaschool/shared';
import { AuthService } from './auth.service';
import { JoiValidationPipe } from '../validation/joi.pipe';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new JoiValidationPipe(CreateUserValidationSchema))
  @MessagePattern(IEventType.USER_LOGIN)
  login(@Payload() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @MessagePattern(IEventType.USER_OAUTH_LOGIN)
  loginOAuth(loginOauthUserDto: LoginOAuthUserDto) {
    return this.authService.loginOAuth(loginOauthUserDto);
  }

  @MessagePattern(IEventType.USER_MFA_LOGIN)
  loginMFA(loginMFAUserDto: LoginMFAUserDto) {
    return this.authService.loginMFA(loginMFAUserDto);
  }
}
