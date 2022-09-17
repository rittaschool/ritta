import { Inject } from '@nestjs/common';
import { Args, Context, Query, Resolver } from '@nestjs/graphql';
<<<<<<< HEAD
import { Challenge, RittaError } from '@rittaschool/shared';
import rittaToNestError from 'src/common/error';
=======
import { Challenge } from '@rittaschool/shared';
>>>>>>> 0c0319102984c8f5b3f4f64c87395aa00e17d3f0
import { CustomContext } from '../graphql-ctx';
import { RID } from '../rid.param';
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
  async startLoginProcess(
    @Args('email') identifier: string,
    @RID() rid: string,
  ) {
    return await this.authService.startLoginProcess(identifier, rid);
  }

  @Query()
  async submitChallenge(
    @Args('challenge') challenge: Challenge,
    @Context() ctx: CustomContext,
  ) {
<<<<<<< HEAD
    try {
      return await this.authService.handleLoginRequest(challenge, ctx.reply);
    } catch (e) {
      if ((e as Error).name === 'RittaException') {
        throw rittaToNestError(e);
      } else {
        throw e;
      }
    }
=======
    const res = await this.authService.handleLoginRequest(challenge, ctx.reply);
    return res;
>>>>>>> 0c0319102984c8f5b3f4f64c87395aa00e17d3f0
  }
}
