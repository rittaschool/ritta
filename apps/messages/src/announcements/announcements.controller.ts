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

  @MessagePattern('get_announcements')
  async getAnnouncements() {
    return []; // TODO: implement
  }

  @MessagePattern('create_announcement')
  async createAnnouncement() {
    return { success: false }; // TODO: implement
  }

  @MessagePattern('edit_announcement')
  async editAnnouncement() {
    return { success: false }; // TODO: implement
  }

  @MessagePattern('archive_announcements')
  async archiveAnnouncements() {
    return { success: false }; // TODO: implement
  }

  @MessagePattern('delete_announcements')
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
