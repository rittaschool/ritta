import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  IEventType,
  RequestDto,
  SearchRecipientsDto,
} from '@rittaschool/shared';
import { UserService } from 'src/services/user.service';
import { RecipientsService } from './recipients.service';

@Controller('recipients')
export class RecipientsController {
  constructor(
    @Inject('RECIPIENTS_SERVICE')
    private readonly recipientsService: RecipientsService,
  ) {}

  @MessagePattern(IEventType.LIST_RECIPIENTS)
  listRecipients(@Payload() request: RequestDto<null>) {
    return this.recipientsService.listRecipients(); // this.recipientsService.getThreads(request.token, request.data);
  }

  @MessagePattern(IEventType.SEARCH_RECIPIENTS)
  searchRecipients(@Payload() request: RequestDto<SearchRecipientsDto>) {
    return null; // this.recipientsService.getThreads(request.token, request.data);
  }
}
