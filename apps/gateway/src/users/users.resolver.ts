import { BadRequestException, Inject, UsePipes } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserDto, CreateUserValidationSchema } from '@rittaschool/shared';
import { JoiValidationPipe } from '../validation/joi.pipe';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(@Inject('USERS_SERVICE') private usersService: UsersService) {}

  @Query()
  async user(@Args('id') id: string) {
    return this.usersService.getUser(id);
  }

  @Query()
  async users() {
    return this.usersService.getUsers();
  }

  @Mutation()
  @UsePipes(new JoiValidationPipe(CreateUserValidationSchema))
  async createUser(@Args('createUserInput') createUserDto: CreateUserDto) {
    console.log('createUser users.resolver');
    const data = (await this.usersService.createUser(createUserDto)) as {
      error?: string;
    };
    if (data.error) {
      throw new BadRequestException(data.error);
    }
    return data;
  }
}
