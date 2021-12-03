import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateUserDto,
  CreateUserValidationSchema,
  IEventType,
  IUser,
  UpdateUserDto,
} from '@rittaschool/shared';
import { catchError, of } from 'rxjs';
import { JoiValidationPipe } from './validation/joi.pipe';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(@Inject('EVENT_BUS') private client: ClientProxy) {}

  @Post('/login')
  @UsePipes(new JoiValidationPipe(CreateUserValidationSchema)) // Validates that the body is right
  async login(@Body() createUserDto: CreateUserDto) {
    // Send message to users microservice and return response, catch errors and send them to client
    return this.client
      .send(IEventType.USER_LOGIN, createUserDto)
      .pipe(catchError((val) => of({ error: val.message })))
      .toPromise();
  }

  @Post('/mfa')
  @UsePipes(new JoiValidationPipe(CreateUserValidationSchema)) // Validates that the body is right
  async loginMFA(@Body() createUserDto: CreateUserDto) {
    // Send message to users microservice and return response, catch errors and send them to client
    return this.client
      .send(IEventType.USER_MFA_LOGIN, createUserDto)
      .pipe(catchError((val) => of({ error: val.message })))
      .toPromise();
  }

  @Post('/oauth')
  @UsePipes(new JoiValidationPipe(CreateUserValidationSchema)) // Validates that the body is right
  async loginOAuth(@Body() createUserDto: CreateUserDto) {
    // Send message to users microservice and return response, catch errors and send them to client
    return this.client
      .send(IEventType.USER_OAUTH_LOGIN, createUserDto)
      .pipe(catchError((val) => of({ error: val.message })))
      .toPromise();
  }
}
