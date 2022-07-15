import { Controller, Inject, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import {
  CreateUserDto,
  CreateUserValidationSchema,
  IEventType,
  Permission,
} from '@rittaschool/shared';
import { Permissions } from '../auth.decorator';
import { JoiValidationPipe } from '../validation/joi.pipe';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(@Inject('USERS_SERVICE') private usersService: UsersService) {}

  @UsePipes(new JoiValidationPipe(CreateUserValidationSchema))
  @MessagePattern(IEventType.USER_CREATED)
  async create(@Payload() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.createUser(createUserDto);
    } catch (e) {
      throw new RpcException(e.message);
    }
  }

  @Permissions(Permission.GET_ALL_USERS)
  @MessagePattern(IEventType.GET_USERS)
  async getUsers() {
    try {
      return await this.usersService.getUsers();
    } catch (err) {
      throw new RpcException(err.message);
    }
  }

  @MessagePattern(IEventType.GET_USER)
  async getUser(
    @Payload() { id, throwError }: { id: string; throwError: boolean },
  ) {
    try {
      return await this.usersService.getUser(id, throwError);
    } catch (e) {
      throw new RpcException('User not found');
    }
  }

  @MessagePattern(IEventType.USER_UPDATED)
  updateUser(@Payload() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(updateUserDto);
  }

  @MessagePattern(IEventType.USER_REMOVED)
  async removeUser(@Payload() { id }: { id: string }) {
    try {
      return await this.usersService.removeUser(id);
    } catch (err) {
      throw new RpcException(err.message);
    }
  }

  @MessagePattern(IEventType.STATUS)
  async status() {
    return {
      status: 'ok',
    };
  }
}
