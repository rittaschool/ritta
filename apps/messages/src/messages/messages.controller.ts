import { Controller, Inject } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { MessagesService } from './messages.service';
import {
  GetThreadsDto,
  IErrorType,
  IEventType,
  NewMessageDto,
  NewThreadDto,
  RequestDto,
  RittaError,
  ThreadActionDto,
} from '@rittaschool/shared';
@Controller()
export class MessagesController {
  constructor(
    @Inject('MESSAGES_SERVICE')
    private readonly messagesService: MessagesService,
  ) {}

  @MessagePattern(IEventType.GET_THREADS)
  getThreads(@Payload() request: RequestDto<GetThreadsDto>) {
    return this.messagesService.getThreads(request.token, request.data);
  }

  @MessagePattern(IEventType.NEW_THREAD)
  async createNewThread(@Payload() request: RequestDto<NewThreadDto>) {
    console.log(request);
    try {
      return await this.messagesService.createThread(
        request.token,
        request.data,
      );
    } catch (e) {
      throw new RpcException(e.message);
    }
  }

  @MessagePattern(IEventType.PUBLISH_DRAFT)
  async publishDraft() {
    return {
      success: false,
    };
  }

  @MessagePattern(IEventType.NEW_MESSAGE)
  async newMessage(@Payload() request: RequestDto<NewMessageDto>) {
    try {
      return await this.messagesService.createMessage(
        request.token,
        request.data,
      );
    } catch (e) {
      throw new RpcException(e.message);
    }
  }

  @MessagePattern(IEventType.DELETE_MESSAGE)
  async deleteMessage() {
    return {
      success: false,
    };
  }

  @MessagePattern(IEventType.EDIT_MESSAGE)
  async editMessage() {
    return {
      success: false,
    };
  }

  @MessagePattern(IEventType.MARK_THREAD_AS_READ)
  async markThreadRead(@Payload() request: RequestDto<ThreadActionDto>) {
    if (!request.data.threadId) {
      throw new RittaError('Thread ID missing', IErrorType.UNKNOWN);
    }
    this.messagesService.markThreadAsRead(request.token, request.data.threadId);
    return {
      success: true,
    };
  }

  @MessagePattern(IEventType.MARK_THREAD_AS_UNREAD)
  async markThreadUnread(@Payload() request: RequestDto<ThreadActionDto>) {
    if (!request.data.threadId) {
      throw new RittaError('Thread ID missing', IErrorType.UNKNOWN);
    }
    this.messagesService.markThreadAsUnread(
      request.token,
      request.data.threadId,
    );
    return {
      success: true,
    };
  }

  @MessagePattern(IEventType.ARCHIVE_THREAD)
  async archiveThread() {
    return {
      success: false,
    };
  }

  /**
   * Removes the thread if it is only the starting message and request by author, otherwise removes only the copy from the user
   */
  @MessagePattern(IEventType.DELETE_THREAD)
  async deleteThread() {
    return {
      success: false,
    };
  }

  @MessagePattern(IEventType.STATUS)
  async status() {
    return {
      status: 'ok',
    };
  }
}
