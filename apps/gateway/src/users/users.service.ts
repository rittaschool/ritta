import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateUserDto,
  IErrorType,
  IEventType,
  IUser,
  RittaError,
  UpdateUserDto,
} from '@rittaschool/shared';
import { catchError, of, timeout } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_BUS') private client: ClientProxy,
    @Inject('LOGGER') private logger: Logger,
  ) {}

  async createUser(createUserDto: CreateUserDto, rid: string): Promise<IUser> {
    this.logger.log({
      rid,
      context: 'UsersService',
      message: `createUser with email ${createUserDto.email} `,
    });

    const res = await this.client
      .send(IEventType.USER_CREATED, createUserDto)
      .pipe(timeout(10000)) // increased timeout
      .pipe(catchError((val) => of({ error: val.message })))
      .toPromise(); // converting observable to promise

    if (res.error) {
      this.logger.error({
        rid,
        context: 'UsersService',
        message: res.error, //TODO: fix because it returns RittaError
      });
      throw new BadRequestException(res.error);
    } else {
      return res.data;
    }
  }

  async getUsers(rid: string): Promise<IUser[]> {
    this.logger.log({
      rid,
      context: 'UsersService',
      message: 'getUsers',
    });
    return this.client
      .send<IUser[]>(IEventType.GET_USERS, { rid })
      .pipe(timeout(5000)) // timeout
      .toPromise();
  }

  async getUser(id: string, rid: string): Promise<IUser> {
    this.logger.log({
      rid,
      context: 'UsersService',
      message: `getUser with id ${id} `,
    });
    return this.client
      .send(IEventType.GET_USER, { id, rid }) // get user with id
      .pipe(catchError((val) => of({ error: val.message }))) // error handling
      .pipe(timeout(5000)) // timeout
      .toPromise(); // converting observable to promise
  }

  async updateUser(updateUserDto: UpdateUserDto, rid: string): Promise<IUser> {
    this.logger.log({
      rid,
      context: 'UsersService',
      message: `updateUser with id ${updateUserDto.email} `,
    });
    return this.client
      .send(IEventType.USER_UPDATED, updateUserDto)
      .pipe(catchError((val) => of({ error: val.message }))) // error handling
      .pipe(timeout(5000)) // timeout
      .toPromise(); // converting observable to promise
  }

  async deleteUser(id: string, rid: string): Promise<IUser> {
    this.logger.log({
      rid,
      context: 'UsersService',
      message: `deleteUser with id ${id} `,
    });
    return this.client
      .send(IEventType.USER_REMOVED, { id })
      .pipe(catchError((val) => of({ error: val.message }))) // error handling
      .pipe(timeout(5000)) // timeout
      .toPromise(); // converting observable to promise
  }
}
