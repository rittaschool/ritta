import { Module } from '@nestjs/common';
import { AnnouncementsService } from './announcemnts.service';
import { AnnouncementsController } from './announcements.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AnnouncementsController],
  imports: [ConfigModule],
  providers: [
    {
      provide: 'ANNOUNCEMENTS_SERVICE',
      useClass: AnnouncementsService,
    },
  ],
})
export class AnnouncementsModule {}
