import { Body, Controller, Inject, Post, UsePipes } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateUserDto,
  IEventType,
  LoginMFAUserDto,
  LoginMFAValidationSchema,
  LoginOAuthUserDto,
  LoginOAuthValidationSchema,
  LoginUserDto,
  LoginValidationSchema,
} from '@rittaschool/shared';
import { catchError, of } from 'rxjs';
import { JoiValidationPipe } from './validation/joi.pipe';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(@Inject('AUTH_BUS') private client: ClientProxy) {}

  @Post('/login')
  @UsePipes(new JoiValidationPipe(LoginValidationSchema)) // Validates that the body is right
  async login(@Body() loginUsertDto: LoginUserDto) {
    // Send message to users microservice and return response, catch errors and send them to client
    return this.client
      .send(IEventType.USER_LOGIN, loginUsertDto)
      .pipe(catchError((val) => of({ error: val.message })))
      .toPromise();
  }

  @Post('/mfa')
  @UsePipes(new JoiValidationPipe(LoginMFAValidationSchema)) // Validates that the body is right
  async loginMFA(@Body() loginMFAUserDto: LoginMFAUserDto) {
    // Send message to users microservice and return response, catch errors and send them to client
    return this.client
      .send(IEventType.USER_MFA_LOGIN, loginMFAUserDto)
      .pipe(catchError((val) => of({ error: val.message })))
      .toPromise();
  }

  @Post('/oauth')
  @UsePipes(new JoiValidationPipe(LoginOAuthValidationSchema)) // Validates that the body is right
  async loginOAuth(@Body() loginOAuthUserDto: LoginOAuthUserDto) {
    // Send message to users microservice and return response, catch errors and send them to client
    return this.client
      .send(IEventType.USER_OAUTH_LOGIN, loginOAuthUserDto)
      .pipe(catchError((val) => of({ error: val.message })))
      .toPromise();
  }
}
