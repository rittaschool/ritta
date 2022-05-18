import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validate } from './validation/env.validation';
import { MessagesModule } from './messages/messages.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { CommonModule } from './common/common.module';
import { TenancyModule } from '@needle-innovision/nestjs-tenancy';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
    }),
    TenancyModule.forRoot({
      uri: (tenantId: string) =>
        process.env.MONGO_URI.replace('{TENANTID}', tenantId),
      options: () => {
        return {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };
      },
      getTenant: async () => {
        return 'TEST';
      },
    }),
    CommonModule,
    MessagesModule,
    AnnouncementsModule,
  ],
})
export class AppModule {}
