import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AnnouncementsService } from './announcemnts.service';
import { IEventType } from '@rittaschool/shared';
@Controller()
export class AnnouncementsController {
  constructor(
    @Inject('ANNOUNCEMENTS_SERVICE')
    private readonly announcementsService: AnnouncementsService,
  ) {}

  @MessagePattern('instance_info')
  async info() {
    return {
      name: await this.announcementsService.getName(),
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
