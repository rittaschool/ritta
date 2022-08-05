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

  @Post()
  @UsePipes(new JoiValidationPipe(CreateUserValidationSchema)) // Validates that the body is right
  async createUser(
    @Body() createUserDto: NewThreadDto,
    @RID() rid: string,
    @User() user: IUser,
  ) {
    return this.messagesService
      .createThread(createUserDto, rid, user)
      .catch((err) => {
        throw new BadRequestException(err);
      });
  }

  @Get()
  async getMessages(@RID() rid: string, @User() user: IUser): Promise<IUser[]> {
    return this.messagesService.getMessages(rid, user);
  }

  @Get('/:id')
  async getUser(@Param('id') id: string, @RID() rid: string): Promise<IUser> {
    return this.messagesService.getUser(id, true, rid);
  }

  @Patch()
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @RID() rid: string,
  ): Promise<IUser> {
    return this.messagesService.updateUser(updateUserDto, rid);
  }

  @Delete('/:id')
  async deleteUser(
    @Param('id') id: string,
    @RID() rid: string,
  ): Promise<IUser> {
    return this.messagesService.deleteUser(id, rid);
  }
}
