import { Inject } from '@nestjs/common';
import { Args, Resolver, Query } from '@nestjs/graphql';
import { LoginUserDto } from '@rittaschool/shared';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {}

  @Query()
  async login(@Args('loginUserDto') loginUserDto: LoginUserDto) {
    return await this.authService.login(loginUserDto); // await is important
  }
}
