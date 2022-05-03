import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MessagesService } from './messages.service';
import { IEventType } from '@rittaschool/shared';
@Controller()
export class MessagesController {
  constructor(
    @Inject('MESSAGES_SERVICE')
    private readonly messagesService: MessagesService,
  ) {}

  @MessagePattern(IEventType.GET_THREADS)
  async getThreads() {
    return [];
  }

  @MessagePattern(IEventType.NEW_THREAD)
  async createNewThread() {
    return {
      success: false,
    };
  }

  @MessagePattern(IEventType.NEW_MESSAGE)
  async newMessage() {
    return {
      success: false,
    };
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
  async markThreadRead() {
    return {
      success: false,
    };
  }

  @MessagePattern(IEventType.MARK_THREAD_AS_UNREAD)
  async markThreadUnread() {
    return {
      success: false,
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
