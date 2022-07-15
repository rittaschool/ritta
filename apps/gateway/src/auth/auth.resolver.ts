import { Inject, Res } from '@nestjs/common';
import { Args, Resolver, Query, Context } from '@nestjs/graphql';
import { Challenge } from '@rittaschool/shared';
import { FastifyReply } from 'fastify';
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
  startLoginProcess(@Args('email') identifier: string, @RID() rid: string) {
    return this.authService.startLoginProcess(identifier, rid);
  }

  @Query()
  async submitChallenge(
    @Args('challenge') challenge: Challenge,
    @Context() ctx: CustomContext,
  ) {
    const res = await this.authService.handleLoginRequest(challenge, ctx.reply);
    console.log(res);
    return res;
  }
}
