import { Args, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query()
  async user(@Args('id') id: string) {
    return this.usersService.getUser(id);
  }

  @Query()
  async users() {
    return this.usersService.getUsers();
  }
}
