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

  @MessagePattern(IEventType.GET_ANNOUNCEMENTS)
  async getAnnouncements() {
    return []; // TODO: implement
  }

  @MessagePattern(IEventType.CREATE_ANNOUNCEMENT)
  async createAnnouncement() {
    return { success: false }; // TODO: implement
  }

  @MessagePattern(IEventType.EDIT_ANNOUNCEMENT)
  async editAnnouncement() {
    return { success: false }; // TODO: implement
  }

  @MessagePattern(IEventType.ARCHIVE_ANNOUNCEMENT)
  async archiveAnnouncements() {
    return { success: false }; // TODO: implement
  }

  @MessagePattern(IEventType.DELETE_ANNOUNCEMENT)
  async deleteAnnouncements() {
    return { success: false }; // TODO: implement
  }

  @MessagePattern(IEventType.STATUS)
  async status() {
    return {
      status: 'ok',
    };
  }
}
