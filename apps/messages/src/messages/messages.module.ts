import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CoreController } from './messages.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [CoreController],
  imports: [ConfigModule],
  providers: [
    {
      provide: 'MESAGES_SERVICE',
      useClass: MessagesService,
    },
  ],
})
export class MessagesModule {}
