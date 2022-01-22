import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateUserDto,
  IEventType,
  IUser,
  UpdateUserDto,
} from '@rittaschool/shared';
import { catchError, of, timeout } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(@Inject('USERS_BUS') private client: ClientProxy) {}

  async createUser(createUserDto: CreateUserDto): Promise<IUser> {
    return this.client
      .send(IEventType.USER_CREATED, createUserDto)
      .pipe(timeout(10000)) // increased timeout
      .pipe(catchError((val) => of({ error: val.message })))
      .toPromise(); // converting observable to promise
  }

  async getUsers(rid: string): Promise<IUser[]> {
    console.log(rid);
    return this.client
      .send<IUser[]>(IEventType.GET_USERS, { rid })
      .pipe(timeout(5000)) // timeout
      .toPromise();
  }

  async getUser(id: string): Promise<IUser> {
    return this.client
      .send(IEventType.GET_USER, { id }) // get user with id
      .pipe(catchError((val) => of({ error: val.message }))) // error handling
      .pipe(timeout(5000)) // timeout
      .toPromise(); // converting observable to promise
  }

  async updateUser(updateUserDto: UpdateUserDto): Promise<IUser> {
    return this.client
      .send(IEventType.USER_UPDATED, updateUserDto)
      .pipe(catchError((val) => of({ error: val.message }))) // error handling
      .pipe(timeout(5000)) // timeout
      .toPromise(); // converting observable to promise
  }

  async deleteUser(id: string): Promise<IUser> {
    return this.client
      .send(IEventType.USER_REMOVED, { id })
      .pipe(catchError((val) => of({ error: val.message }))) // error handling
      .pipe(timeout(5000)) // timeout
      .toPromise(); // converting observable to promise
  }
}
