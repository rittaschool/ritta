import { BadRequestException, Inject, Logger, UsePipes } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserDto, CreateUserValidationSchema } from '@rittaschool/shared';
import { RID } from '../rid.param';
import { JoiValidationPipe } from '../validation/joi.pipe';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(@Inject('USERS_SERVICE') private usersService: UsersService) {}

  @Query()
  async user(@Args('id') id: string, @RID() rid: string) {
    return this.usersService.getUser(id, rid);
  }

  @Query()
  async users(@RID() rid: string) {
    return this.usersService.getUsers(rid);
  }

  @Mutation()
  //@UsePipes(new JoiValidationPipe(CreateUserValidationSchema))
  async createUser(
    @Args('createUserInput') createUserDto: CreateUserDto,
    @RID() rid: string,
  ) {
    const data = await this.usersService.createUser(createUserDto, rid);
    return data;
  }
}
