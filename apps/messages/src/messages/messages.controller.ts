import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MessagesService } from './messages.service';
import { IEventType } from '@rittaschool/shared';
@Controller()
export class CoreController {
  constructor(
    @Inject('MESSAGES_SERVICE')
    private readonly messagesService: MessagesService,
  ) {}

  @MessagePattern('get_threads')
  async getThreads() {
    return [];
  }

  @MessagePattern('new_thread')
  async createNewThread() {
    return {
      success: false,
    };
  }

  @MessagePattern('new_message')
  async newMessage() {
    return {
      success: false,
    };
  }

  @MessagePattern('delete_message')
  async deleteMessage() {
    return {
      success: false,
    };
  }

  @MessagePattern('edit_message')
  async editMessage() {
    return {
      success: false,
    };
  }

  @MessagePattern('mark_as_read')
  async markThreadRead() {
    return {
      success: false,
    };
  }

  @MessagePattern('mark_as_unread')
  async markThreadUnread() {
    return {
      success: false,
    };
  }

  @MessagePattern('archive_thread')
  async archiveThread() {
    return {
      success: false,
    };
  }

  /**
   * Removes the thread if it is only the starting message and request by author, otherwise removes only the copy from the user
   */
  @MessagePattern('remove_thread')
  async removeThread() {
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
