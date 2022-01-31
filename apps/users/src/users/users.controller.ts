import {
  Controller,
  Inject,
  UseInterceptors,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import {
  IEventType,
  CreateUserDto,
  CreateUserValidationSchema,
  Permission,
} from '@rittaschool/shared';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JoiValidationPipe } from '../validation/joi.pipe';
import { LoggingInterceptor } from '../common/logging.interceptor';
import { PermissionsGuard } from '../auth.guard';
import { Permissions } from '../auth.decorator';

@UseInterceptors(LoggingInterceptor)
@Controller()
export class UsersController {
  constructor(@Inject('USERS_SERVICE') private usersService: UsersService) {}

  @UsePipes(new JoiValidationPipe(CreateUserValidationSchema))
  @MessagePattern(IEventType.USER_CREATED)
  create(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Permissions(Permission.GET_ALL_USERS)
  @MessagePattern(IEventType.GET_USERS)
  getUsers() {
    return this.usersService.getUsers();
  }

  @MessagePattern(IEventType.GET_USER)
  getUser(@Payload() { id }: { id: string }) {
    return this.usersService.getUser(id, true);
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
}
