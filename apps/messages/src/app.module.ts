import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validate } from './validation/env.validation';
import { MessagesModule } from './messages/messages.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
    }),
    CommonModule,
    MessagesModule,
    AnnouncementsModule,
  ],
})
export class AppModule {}
