import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { ConfigModule } from '@nestjs/config';
import { MessagesRepository } from './messages.repository';
import { ThreadsRepository } from './threads.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Message } from '@rittaschool/shared';
import { MessageSchema } from './entities/message.entity';
import { ThreadSchema } from './entities/thread.entity';

@Module({
  controllers: [MessagesController],
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: 'Thread', schema: ThreadSchema },
    ]),
    ConfigModule,
  ],
  providers: [
    {
      provide: 'MESSAGES_SERVICE',
      useClass: MessagesService,
    },
    {
      provide: 'MESSAGES_REPOSITORY',
      useClass: MessagesRepository,
    },
    {
      provide: 'THREADS_REPOSITORY',
      useClass: ThreadsRepository,
    },
  ],
})
export class MessagesModule {}
