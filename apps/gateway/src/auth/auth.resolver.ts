import { Inject } from '@nestjs/common';
import { Args, Resolver, Query } from '@nestjs/graphql';
import { LoginUserDto } from '@rittaschool/shared';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
    @Inject('USERS_SERVICE') private readonly userService: UsersService,
  ) {}

  @Query()
  async login(@Args('loginUserDto') loginUserDto: LoginUserDto) {
    const authServiceRes = await this.authService.login(loginUserDto); // await is important
    const user = await this.userService.getUser(loginUserDto.username);

    return {
      user,
      token: authServiceRes.token,
      refreshToken: authServiceRes.refreshToken,
      type: authServiceRes.type,
    };
  }
}
