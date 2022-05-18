import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserDto, IUser } from '@rittaschool/shared';
import { RID } from '../rid.param';
import { User } from '../user.param';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(@Inject('USERS_SERVICE') private usersService: UsersService) {}

  @Query()
  async me(@User() user: IUser) {
    return user;
  }
  @Query()
  async users(@RID() rid: string, @User() user: IUser) {
    return this.usersService.getUsers(rid, user);
  }

  @Query()
  async user(@Args('id') id: string, @RID() rid: string) {
    return this.usersService.getUser(id, true, rid);
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
