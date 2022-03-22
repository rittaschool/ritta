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

  @MessagePattern('instance_info')
  async info() {
    return {
      name: await this.messagesService.getName(),
      authMethods: ['password'], // TODO: get methods from auth module, when implemented
    };
  }

  @MessagePattern(IEventType.STATUS)
  async status() {
    return {
      status: 'ok',
    };
  }
}
