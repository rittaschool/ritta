import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  IEventType,
  IUser,
  NewMessageDto,
  NewThreadDto,
  ThreadActionDto,
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
        token: await this.tokenizer.sign({
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
      return res;
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
        token: await this.tokenizer.sign({
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

  async markAsRead(threadActionDto: ThreadActionDto, user: IUser, rid: string) {
    const res = await this.client
      .send(IEventType.MARK_THREAD_AS_READ, {
        rid,
        token: await this.tokenizer.sign({
          permissions: user.permissions,
          uid: user.id,
        }),
        data: threadActionDto,
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
      return res;
    }
  }

  async markAsUnread(
    threadActionDto: ThreadActionDto,
    user: IUser,
    rid: string,
  ) {
    const res = await this.client
      .send(IEventType.MARK_THREAD_AS_UNREAD, {
        rid,
        token: await this.tokenizer.sign({
          permissions: user.permissions,
          uid: user.id,
        }),
        data: threadActionDto,
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
      return res;
    }
  }

  async newMessage(newMessageDto: NewMessageDto, user: IUser, rid: string) {
    const res = await this.client
      .send(IEventType.NEW_MESSAGE, {
        rid,
        token: await this.tokenizer.sign({
          permissions: user.permissions,
          uid: user.id,
        }),
        data: newMessageDto,
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
      return res;
    }
  }
}
