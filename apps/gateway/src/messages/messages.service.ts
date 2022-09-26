import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  EditMessageDto,
  IAccount,
  IEventType,
  IUser,
  NewMessageDto,
  NewThreadDto,
  ThreadActionDto,
} from '@rittaschool/shared';
import { catchError, of, timeout } from 'rxjs';
import sanitize from 'sanitize-html';
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
    user: IUser,
    account: IAccount,
    rid: string,
  ): Promise<IUser> {
    this.logger.log({
      rid,
      context: 'MessagesService',
      message: `createThread with name ${createThreadDto.name} `,
    });
    createThreadDto.content = sanitize(createThreadDto.content, {
      allowedTags: sanitize.defaults.allowedTags.concat(['img']),
      allowedAttributes: {
        img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading'],
      },
    });
    createThreadDto.name = sanitize(createThreadDto.name, {
      allowedTags: sanitize.defaults.allowedTags.concat(['img']),
      allowedAttributes: {
        img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading'],
      },
    });
    const res = await this.client
      .send(IEventType.NEW_THREAD, {
        rid,
        token: await this.tokenizer.sign({
          permissions: account.permissions,
          uid: user.id,
          aid: account.id,
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

  async getThreads(
    user: IUser,
    account: IAccount,
    rid: string,
  ): Promise<IUser[]> {
    this.logger.log({
      rid,
      context: 'MessagesService',
      message: 'getThreads',
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
          permissions: account.permissions,
          uid: user.id,
          aid: account.id,
        }),
      })
      .pipe(catchError((val) => of({ error: val.message })))
      .pipe(timeout(5000)) // timeout
      .toPromise();
  }

  async markAsRead(
    threadActionDto: ThreadActionDto,
    user: IUser,
    account: IAccount,
    rid: string,
  ) {
    const res = await this.client
      .send(IEventType.MARK_THREAD_AS_READ, {
        rid,
        token: await this.tokenizer.sign({
          permissions: account.permissions,
          uid: user.id,
          aid: account.id,
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
    account: IAccount,
    rid: string,
  ) {
    const res = await this.client
      .send(IEventType.MARK_THREAD_AS_UNREAD, {
        rid,
        token: await this.tokenizer.sign({
          permissions: account.permissions,
          uid: user.id,
          aid: account.id,
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

  async newMessage(
    newMessageDto: NewMessageDto,
    user: IUser,
    account: IAccount,
    rid: string,
  ) {
    // Sanitize
    newMessageDto.content = sanitize(newMessageDto.content, {
      allowedTags: sanitize.defaults.allowedTags.concat(['img']),
      allowedAttributes: {
        img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading'],
      },
    });

    const res = await this.client
      .send(IEventType.NEW_MESSAGE, {
        rid,
        token: await this.tokenizer.sign({
          permissions: account.permissions,
          uid: user.id,
          aid: account.id,
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

  async editMessage(
    editMessageDto: EditMessageDto,
    user: IUser,
    account: IAccount,
    rid: string,
  ) {
    const res = await this.client
      .send(IEventType.EDIT_MESSAGE, {
        rid,
        token: await this.tokenizer.sign({
          permissions: account.permissions,
          uid: user.id,
          aid: account.id,
        }),
        data: editMessageDto,
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

  async publishDraft(
    threadActionDto: ThreadActionDto,
    user: IUser,
    account: IAccount,
    rid: string,
  ) {
    const res = await this.client
      .send(IEventType.PUBLISH_DRAFT, {
        rid,
        token: await this.tokenizer.sign({
          permissions: account.permissions,
          uid: user.id,
          aid: account.id,
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

  async deleteThread(
    threadActionDto: ThreadActionDto,
    user: IUser,
    account: IAccount,
    rid: string,
  ) {
    const res = await this.client
      .send(IEventType.DELETE_THREAD, {
        rid,
        token: await this.tokenizer.sign({
          permissions: account.permissions,
          uid: user.id,
          aid: account.id,
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
}
