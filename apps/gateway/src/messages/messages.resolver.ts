import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserDto, IUser, NewThreadDto } from '@rittaschool/shared';
import { RID } from '../rid.param';
import { User } from '../user.param';
import { MessagesService } from './messages.service';

@Resolver()
export class MessagesResolver {
  constructor(
    @Inject('MESSAGES_SERVICE') private messagesService: MessagesService,
  ) {}

  @Query()
  async messages(@RID() rid: string, @User() user: IUser) {
    const messages = await this.messagesService.getMessages(rid, user);
    console.log(messages);
    return messages;
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
