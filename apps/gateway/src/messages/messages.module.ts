import { Module } from '@nestjs/common';
import { Tokenizer } from '../validation/tokenizer';
import { MessagesController } from './messages.controller';
import { MessagesResolver } from './messages.resolver';
import { MessagesService } from './messages.service';

@Module({
  providers: [
    {
      provide: 'MESSAGES_RESOLVER',
      useClass: MessagesResolver,
    },
    {
      provide: 'MESSAGES_SERVICE',
      useClass: MessagesService,
    },
    {
      provide: 'TOKENIZER',
      useClass: Tokenizer,
    },
  ],
  controllers: [MessagesController],
  exports: ['MESSAGES_SERVICE'],
})
export class MessagesModule {}
