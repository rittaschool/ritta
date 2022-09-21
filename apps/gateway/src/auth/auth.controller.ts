import { Body, Controller, Inject, Post, UsePipes } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  IEventType,
  LoginMFAUserDto,
  LoginMFAValidationSchema,
  LoginOAuthUserDto,
  LoginOAuthValidationSchema,
  LoginUserDto,
  LoginValidationSchema,
} from '@rittaschool/shared';
import { catchError, of } from 'rxjs';
import { JoiValidationPipe } from '../validation/joi.pipe';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(@Inject('AUTH_BUS') private client: ClientProxy) {}

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
