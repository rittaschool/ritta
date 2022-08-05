import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  EditMessageDto,
  IUser,
  NewMessageDto,
  NewThreadDto,
} from '@rittaschool/shared';
import { RID } from '../rid.param';
import { User } from '../user.param';
import { MessagesService } from './messages.service';

@Resolver()
export class MessagesResolver {
  constructor(
    @Inject('MESSAGES_SERVICE') private messagesService: MessagesService,
  ) {}

  @Query()
  async threads(@RID() rid: string, @User() user: IUser) {
    const threads = await this.messagesService.getThreads(rid, user);
    return threads;
  }

  @Mutation()
  //@UsePipes(new JoiValidationPipe(CreateUserValidationSchema))
  async createThread(
    @Args('createThreadInput') createThreadDto: NewThreadDto,
    @RID() rid: string,
    @User() user: IUser,
  ) {
    const data = await this.messagesService.createThread(
      createThreadDto,
      rid,
      user,
    );
    return data;
  }

  @Mutation()
  //@UsePipes(new JoiValidationPipe(CreateUserValidationSchema))
  async newMessage(
    @Args('createMessageInput') createMessageInput: NewMessageDto,
    @RID() rid: string,
    @User() user: IUser,
  ) {
    const data = await this.messagesService.newMessage(
      createMessageInput,
      user,
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
  ) {
    const data = await this.messagesService.editMessage(
      editMessageDto,
      user,
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
  ) {
    const data = await this.messagesService.markAsRead({ threadId }, user, rid);
    return data;
  }

  @Mutation()
  //@UsePipes(new JoiValidationPipe(CreateUserValidationSchema))
  async markAsUnread(
    @Args('threadId') threadId: string,
    @RID() rid: string,
    @User() user: IUser,
  ) {
    const data = await this.messagesService.markAsUnread(
      { threadId },
      user,
      rid,
    );
    return data;
  }
}
