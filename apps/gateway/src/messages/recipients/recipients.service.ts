import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IAccount, IEventType, IUser } from '@rittaschool/shared';
import { catchError, of, timeout } from 'rxjs';
import { Tokenizer } from 'src/validation/tokenizer';

@Injectable()
export class RecipientsService {
  constructor(
    @Inject('MESSAGES_BUS') private client: ClientProxy,
    @Inject('LOGGER') private logger: Logger,
    @Inject('TOKENIZER') private tokenizer: Tokenizer,
  ) {}

  async listRecipients(
    rid: string,
    user: IUser,
    account: IAccount,
  ): Promise<any> {
    this.logger.log({
      rid,
      context: 'RecipientsService',
      message: 'getRecipients',
    });
    // const perms = Permissions.addPermissions(
    //   0,
    //   Permission.GET_ALL_Messages,
    //   Permission.INSTALL_PLUGIN,
    // );

    return this.client
      .send(IEventType.LIST_RECIPIENTS, {
        rid,
        token: await this.tokenizer.sign({
          permissions: account.permissions || 0,
          uid: user.id,
          aid: account.id,
        }),
      })
      .pipe(catchError((val) => of({ error: val.message })))
      .pipe(timeout(5000)) // timeout
      .toPromise();
  }
}
