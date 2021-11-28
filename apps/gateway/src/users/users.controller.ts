import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
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
import { JoiValidationPipe } from '../validation/joi.pipe';
import { UsersService } from './users.service';

@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UsePipes(new JoiValidationPipe(CreateUserValidationSchema)) // Validates that the body is right
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto).catch((err) => {
      throw new BadRequestException(err);
    });
  }

  @Get()
  async getUsers(): Promise<IUser[]> {
    return this.usersService.getUsers();
  }

  @Get('/:id')
  async getUser(@Param('id') id: string): Promise<IUser> {
    return this.usersService.getUser(id);
  }

  @Patch()
  async updateUser(@Body() updateUserDto: UpdateUserDto): Promise<IUser> {
    return this.usersService.updateUser(updateUserDto);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string): Promise<IUser> {
    return this.usersService.deleteUser(id);
  }
}
