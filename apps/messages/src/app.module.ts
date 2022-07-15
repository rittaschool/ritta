import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'framework';
import { AnnouncementsModule } from './announcements/announcements.module';
import { MessagesModule } from './messages/messages.module';
import { MongooseConfigService } from './mongoose';
import { validate } from './validation/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    CommonModule,
    MessagesModule,
    AnnouncementsModule,
  ],
})
export class AppModule {}
