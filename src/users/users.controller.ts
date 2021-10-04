import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FilteredUser, UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller({ version: '1', path: 'users' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.filterUser(
      await this.usersService.create(createUserDto),
    );
  }

  @Get()
  async getUsers(): Promise<FilteredUser[]> {
    const filteredUsers: FilteredUser[] = [];

    (await this.usersService.findAll()).forEach(async (user) => {
      filteredUsers.push(await this.usersService.filterUser(user));
    });

    return filteredUsers;
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.usersService.filterUser(await this.usersService.findOne(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async removeUser(@Param('id') id: string) {
    return this.usersService.filterUser(await this.usersService.remove(id));
  }
}
