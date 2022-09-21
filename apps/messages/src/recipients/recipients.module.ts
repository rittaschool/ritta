import { Module } from '@nestjs/common';
import { RecipientsService } from './recipients.service';
import { RecipientsController } from './recipients.controller';
import { Tokenizer } from 'src/tokenizer';
import { ServicesModule } from 'src/services/services.module';

@Module({
  providers: [
    {
      provide: 'TOKENIZER',
      useClass: Tokenizer,
    },
    {
      provide: 'RECIPIENTS_SERVICE',
      useClass: RecipientsService,
    },
  ],
  imports: [ServicesModule],
  controllers: [RecipientsController],
})
export class RecipientsModule {}
