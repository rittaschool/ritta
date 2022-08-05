import { Inject } from '@nestjs/common';
import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { Challenge, RittaError } from '@rittaschool/shared';
import rittaToNestError from 'src/common/error';
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
    try {
      return await this.authService.handleLoginRequest(challenge, ctx.reply);
    } catch (e) {
      if ((e as Error).name === 'RittaException') {
        throw rittaToNestError(e);
      } else {
        throw e;
      }
    }
  }
}
