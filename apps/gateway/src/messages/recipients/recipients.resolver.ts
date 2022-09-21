import { Resolver, Query } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { IUser } from '@rittaschool/shared';
import { RID } from 'src/rid.param';
import { User } from 'src/user.param';
import { RecipientsService } from './recipients.service';

@Resolver()
export class RecipientsResolver {
  constructor(
    @Inject('RECIPIENTS_SERVICE') private recipientsService: RecipientsService,
  ) {}

  // TODO: add auth check thingy
  @Query()
  async recipients(@RID() rid: string, @User() user: IUser) {
    console.log('query gets here');
    const threads = await this.recipientsService.listRecipients(rid, user);
    return threads;
  }
}
