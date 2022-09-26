import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  EditMessageDto,
  IAccount,
  IUser,
  NewMessageDto,
  NewThreadDto,
} from '@rittaschool/shared';
import { RID } from '../rid.param';
import { User } from '../user.param';
import { Account } from '../account.param';
import { MessagesService } from './messages.service';

@Resolver()
export class MessagesResolver {
  constructor(
    @Inject('MESSAGES_SERVICE') private messagesService: MessagesService,
  ) {}

  @Query()
  async threads(
    @RID() rid: string,
    @User() user: IUser,
    @Account() account: IAccount,
  ) {
    const threads = await this.messagesService.getThreads(user, account, rid);
    return threads;
  }

  @Mutation()
  //@UsePipes(new JoiValidationPipe(CreateUserValidationSchema))
  async createThread(
    @Args('createThreadInput') createThreadDto: NewThreadDto,
    @RID() rid: string,
    @User() user: IUser,
    @Account() account: IAccount,
  ) {
    const data = await this.messagesService.createThread(
      createThreadDto,
      user,
      account,
      rid,
    );
    return data;
  }

  @Mutation()
  //@UsePipes(new JoiValidationPipe(CreateUserValidationSchema))
  async newMessage(
    @Args('createMessageInput') createMessageInput: NewMessageDto,
    @RID() rid: string,
    @User() user: IUser,
    @Account() account: IAccount,
  ) {
    const data = await this.messagesService.newMessage(
      createMessageInput,
      user,
      account,
      rid,
    );
    return data;
  }

  @Mutation()
  //@UsePipes(new JoiValidationPipe(CreateUserValidationSchema))
  async editMessage(
    @Args('editMessageInput') editMessageDto: EditMessageDto,
    @RID() rid: string,
    @User() user: IUser,
    @Account() account: IAccount,
  ) {
    const data = await this.messagesService.editMessage(
      editMessageDto,
      user,
      account,
      rid,
    );
    return data;
  }

  @Mutation()
  //@UsePipes(new JoiValidationPipe(CreateUserValidationSchema))
  async markAsRead(
    @Args('threadId') threadId: string,
    @RID() rid: string,
    @User() user: IUser,
    @Account() account: IAccount,
  ) {
    const data = await this.messagesService.markAsRead(
      { threadId },
      user,
      account,
      rid,
    );
    return data;
  }

  @Mutation()
  //@UsePipes(new JoiValidationPipe(CreateUserValidationSchema))
  async markAsUnread(
    @Args('threadId') threadId: string,
    @RID() rid: string,
    @User() user: IUser,
    @Account() account: IAccount,
  ) {
    const data = await this.messagesService.markAsUnread(
      { threadId },
      user,
      account,
      rid,
    );
    return data;
  }

  @Mutation()
  //@UsePipes(new JoiValidationPipe(CreateUserValidationSchema))
  async publishDraft(
    @Args('threadId') threadId: string,
    @RID() rid: string,
    @User() user: IUser,
    @Account() account: IAccount,
  ) {
    const data = await this.messagesService.publishDraft(
      { threadId },
      user,
      account,
      rid,
    );
    return data;
  }

  @Mutation()
  //@UsePipes(new JoiValidationPipe(CreateUserValidationSchema))
  async deleteThread(
    @Args('threadId') threadId: string,
    @RID() rid: string,
    @User() user: IUser,
    @Account() account: IAccount,
  ) {
    const data = await this.messagesService.deleteThread(
      { threadId },
      user,
      account,
      rid,
    );
    return data;
  }
}
