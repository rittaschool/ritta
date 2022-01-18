import { Inject } from '@nestjs/common';
import { Args, Resolver, Query } from '@nestjs/graphql';
import { Challenge } from '@rittaschool/shared';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {}

  // @Query()
  // async login(@Args('loginUserDto') loginUserDto: LoginUserDto) {
  //   return await this.authService.login(loginUserDto); // await is important
  // }

  @Query()
  startLoginProcess(@Args('email') identifier: string) {
    return this.authService.startLoginProcess(identifier);
  }

  @Query()
  async submitChallenge(@Args('challenge') challenge: Challenge) {
    const res = await this.authService.handleLoginRequest(challenge);
    console.log(res);
    return res;
  }
}
