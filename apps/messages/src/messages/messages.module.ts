import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { ConfigModule } from '@nestjs/config';
import { MessagesRepository } from './messages.repository';

@Module({
  controllers: [MessagesController],
  imports: [ConfigModule],
  providers: [
    {
      provide: 'MESSAGES_SERVICE',
      useClass: MessagesService,
    },
    {
      provide: 'MESSAGES_REPOSITORY',
      useClass: MessagesRepository,
    },
  ],
})
export class MessagesModule {}
