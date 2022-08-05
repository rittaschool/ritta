import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import {
  CreateUserDto,
  CreateUserValidationSchema,
  IUser,
  NewThreadDto,
  UpdateUserDto,
} from '@rittaschool/shared';
import { RID } from '../rid.param';
import { User } from '../user.param';
import { JoiValidationPipe } from '../validation/joi.pipe';
import { MessagesService } from './messages.service';

@Controller({
  path: 'Messages',
  version: '1',
})
export class MessagesController {
  constructor(
    @Inject('MESSAGES_SERVICE') private messagesService: MessagesService,
    @Inject('LOGGER') private logger: Logger,
  ) {}
}
