import { Resolver, Query } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { IAccount, IUser } from '@rittaschool/shared';
import { RID } from 'src/rid.param';
import { User } from 'src/user.param';
import { RecipientsService } from './recipients.service';
import { Account } from 'src/account.param';

@Resolver()
export class RecipientsResolver {
  constructor(
    @Inject('RECIPIENTS_SERVICE') private recipientsService: RecipientsService,
  ) {}

  // TODO: add auth check thingy
  @Query()
  async recipients(
    @RID() rid: string,
    @User() user: IUser,
    @Account() account: IAccount,
  ) {
    console.log('query gets here');
    const threads = await this.recipientsService.listRecipients(
      rid,
      user,
      account,
    );
    return threads;
  }
}
