import { Module } from '@nestjs/common';
import { AnnouncementsService } from './announcemnts.service';
import { AnnouncementsController } from './announcements.controller';
import { ConfigModule } from '@nestjs/config';
import { Announcement } from '@rittaschool/shared';
import { AnnouncementSchema } from './entities/announcement.entity';
import { AnnouncementsRepository } from './announcements.repository';
import { TenancyModule } from '@needle-innovision/nestjs-tenancy';

@Module({
  controllers: [AnnouncementsController],
  imports: [
    TenancyModule.forFeature([
      { name: Announcement.name, schema: AnnouncementSchema },
    ]),
    ConfigModule,
  ],
  providers: [
    {
      provide: 'ANNOUNCEMENTS_SERVICE',
      useClass: AnnouncementsService,
    },
    {
      provide: 'ANNOUNCEMENTS_REPOSITORY',
      useClass: AnnouncementsRepository,
    },
  ],
})
export class AnnouncementsModule {}
