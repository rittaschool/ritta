import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [MessagesController],
  imports: [ConfigModule],
  providers: [
    {
      provide: 'MESSAGES_SERVICE',
      useClass: MessagesService,
    },
  ],
})
export class MessagesModule {}
