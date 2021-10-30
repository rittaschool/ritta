import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateUserDto,
  CreateUserValidationSchema,
  IEventType,
  IUser,
} from '@rittaschool/shared';
import { catchError, of } from 'rxjs';
import { JoiValidationPipe } from './validation/joi.pipe';

@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(@Inject('EVENT_BUS') private client: ClientProxy) {}

  @Post()
  @UsePipes(new JoiValidationPipe(CreateUserValidationSchema)) // Validates that the body is right
  async createUser(@Body() createUserDto: CreateUserDto) {
    // Send message to users microservice and return response, catch errors and send them to client
    return this.client
      .send(IEventType.USER_CREATED, createUserDto)
      .pipe(catchError((val) => of({ error: val.message })))
      .toPromise();
  }

  @Get()
  async getUsers(): Promise<IUser[]> {
    return this.client.send<IUser[]>('get_users', {}).toPromise();
  }

  @Get('/:id')
  async getUser(@Param('id') id: string): Promise<IUser> {
    // Send message to users microservice and return response, catch errors and send them to client
    return this.client
      .send('get_user', { id })
      .pipe(catchError((val) => of({ error: val.message })))
      .toPromise();
  }
}
