import { Module } from '@nestjs/common';
import { Tokenizer } from '../validation/tokenizer';
import { MessagesResolver } from './messages.resolver';
import { MessagesService } from './messages.service';
import { RecipientsService } from './recipients/recipients.service';
import { RecipientsModule } from './recipients/recipients.module';

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
    RecipientsService,
  ],
  exports: ['MESSAGES_SERVICE'],
  imports: [RecipientsModule],
})
export class MessagesModule {}
