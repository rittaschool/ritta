import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateUserDto,
  IEventType,
  IUser,
  NewThreadDto,
  UpdateUserDto,
} from '@rittaschool/shared';
import { catchError, of, timeout } from 'rxjs';
import { Tokenizer } from '../validation/tokenizer';

@Injectable()
export class MessagesService {
  constructor(
    @Inject('MESSAGES_BUS') private client: ClientProxy,
    @Inject('LOGGER') private logger: Logger,
    @Inject('TOKENIZER') private tokenizer: Tokenizer,
  ) {}

  async createThread(
    createThreadDto: NewThreadDto,
    rid: string,
    user: IUser,
  ): Promise<IUser> {
    this.logger.log({
      rid,
      context: 'MessagesService',
      message: `createThread with name ${createThreadDto.name} `,
    });

    const res = await this.client
      .send(IEventType.NEW_THREAD, {
        rid,
        token: this.tokenizer.sign({
          permissions: user.permissions,
          uid: user.id,
        }),
        data: createThreadDto,
      })
      .pipe(timeout(10000)) // increased timeout
      .pipe(catchError((val) => of({ error: val.message })))
      .toPromise(); // converting observable to promise

    if (res.error) {
      this.logger.error({
        rid,
        context: 'MessagesService',
        message: res.error, //TODO: fix because it returns RittaError
      });
      throw new BadRequestException(res.error);
    } else {
      return res.data;
    }
  }

  async getMessages(rid: string, user: IUser): Promise<IUser[]> {
    this.logger.log({
      rid,
      context: 'MessagesService',
      message: 'getMessages',
    });
    // const perms = Permissions.addPermissions(
    //   0,
    //   Permission.GET_ALL_Messages,
    //   Permission.INSTALL_PLUGIN,
    // );

    return this.client
      .send(IEventType.GET_THREADS, {
        rid,
        token: this.tokenizer.sign({
          permissions: user.permissions,
          uid: user.id,
        }),
      })
      .pipe(catchError((val) => of({ error: val.message })))
      .pipe(timeout(5000)) // timeout
      .toPromise();
  }

  async getUser(id: string, throwError = true, rid: string): Promise<IUser> {
    this.logger.log({
      rid,
      context: 'MessagesService',
      message: `getUser with id ${id} `,
    });
    const user = await this.client
      .send(IEventType.GET_USER, { id, rid, throwError }) // get user with id
      .pipe(catchError((val) => of({ error: val.message }))) // error handling
      .pipe(timeout(5000)) // timeout
      .toPromise(); // converting observable to promise

    if (throwError && !user) {
      throw new BadRequestException('User not found');
    }

    if (throwError && user.error) {
      throw new BadRequestException(user.error);
    } else {
      return user;
    }
  }

  async updateUser(updateUserDto: UpdateUserDto, rid: string): Promise<IUser> {
    this.logger.log({
      rid,
      context: 'MessagesService',
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
      context: 'MessagesService',
      message: `deleteUser with id ${id} `,
    });
    return this.client
      .send(IEventType.USER_REMOVED, { id })
      .pipe(catchError((val) => of({ error: val.message }))) // error handling
      .pipe(timeout(5000)) // timeout
      .toPromise(); // converting observable to promise
  }
}
