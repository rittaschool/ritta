import { Controller, Inject, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import {
  IEventType,
  CreateUserDto,
  CreateUserValidationSchema,
} from '@rittaschool/shared';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JoiValidationPipe } from '../validation/joi.pipe';

@Controller()
export class UsersController {
  constructor(@Inject('USERS_SERVICE') private usersService: UsersService) {}

  @UsePipes(new JoiValidationPipe(CreateUserValidationSchema))
  @MessagePattern(IEventType.USER_CREATED)
  create(@Payload() createUserDto: CreateUserDto) {
    console.log('createUser users.controller');
    return this.usersService.create(createUserDto);
  }

  @MessagePattern(IEventType.GET_USERS)
  getUsers() {
    return this.usersService.findAll();
  }

  @MessagePattern(IEventType.GET_USER)
  getUser(@Payload() { id }: { id: string }) {
    return this.usersService.findOne(id);
  }

  @MessagePattern(IEventType.USER_UPDATED)
  updateUser(@Payload() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto.id, updateUserDto);
  }

  @MessagePattern(IEventType.USER_REMOVED)
  async remove(@Payload() { id }: { id: string }) {
    try {
      return await this.usersService.remove(id);
    } catch (err) {
      throw new RpcException(err.message);
    }
  }
}
