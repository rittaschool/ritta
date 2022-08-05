import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'framework';
import { AnnouncementsModule } from './announcements/announcements.module';
import { MessagesModule } from './messages/messages.module';
import { MongooseConfigService } from './mongoose';
import { validate } from './validation/env.validation';
import { Tokenizer } from './tokenizer';
import { PermissionsGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';

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
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: 'TOKENIZER',
      useClass: Tokenizer,
    },
  ],
})
export class AppModule {}
