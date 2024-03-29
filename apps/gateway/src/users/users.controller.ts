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
  UpdateUserDto,
} from '@rittaschool/shared';
import { RID } from '../rid.param';
import { User } from '../user.param';
import { JoiValidationPipe } from '../validation/joi.pipe';
import { UsersService } from './users.service';

@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(
    @Inject('USERS_SERVICE') private usersService: UsersService,
    @Inject('LOGGER') private logger: Logger,
  ) {}

  @Post()
  @UsePipes(new JoiValidationPipe(CreateUserValidationSchema)) // Validates that the body is right
  async createUser(@Body() createUserDto: CreateUserDto, @RID() rid: string) {
    return this.usersService.createUser(createUserDto, rid).catch((err) => {
      throw new BadRequestException(err);
    });
  }

  @Get()
  async getUsers(@RID() rid: string, @User() user: IUser): Promise<IUser[]> {
    return this.usersService.getUsers(rid, user);
  }

  @Get('/:id')
  async getUser(@Param('id') id: string, @RID() rid: string): Promise<IUser> {
    return this.usersService.getUser(id, true, rid);
  }

  @Patch()
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @RID() rid: string,
  ): Promise<IUser> {
    return this.usersService.updateUser(updateUserDto, rid);
  }

  @Delete('/:id')
  async deleteUser(
    @Param('id') id: string,
    @RID() rid: string,
  ): Promise<IUser> {
    return this.usersService.deleteUser(id, rid);
  }
}
