import { Controller, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
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
  constructor(private readonly usersService: UsersService) {}

  @UsePipes(new JoiValidationPipe(CreateUserValidationSchema))
  @MessagePattern(IEventType.USER_CREATED)
  create(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @MessagePattern('findAllUsers')
  findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern('findOneUser')
  findOne(@Payload() id: string) {
    return this.usersService.findOne(id);
  }

  @MessagePattern(IEventType.USER_UPDATED)
  update(@Payload() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto.id, updateUserDto);
  }

  @MessagePattern(IEventType.USER_REMOVED)
  remove(@Payload() id: string) {
    return this.usersService.remove(id);
  }
}
