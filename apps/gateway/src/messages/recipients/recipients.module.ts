import { Module } from '@nestjs/common';
import { Tokenizer } from 'src/validation/tokenizer';
import { RecipientsResolver } from './recipients.resolver';
import { RecipientsService } from './recipients.service';

@Module({
  providers: [
    {
      provide: 'RECIPIENTS_RESOLVER',
      useClass: RecipientsResolver,
    },
    {
      provide: 'RECIPIENTS_SERVICE',
      useClass: RecipientsService,
    },
    {
      provide: 'TOKENIZER',
      useClass: Tokenizer,
    },
  ],
})
export class RecipientsModule {}
