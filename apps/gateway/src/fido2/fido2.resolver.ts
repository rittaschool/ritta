import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Fido2Service } from './fido2.service';

@Resolver()
export class Fido2Resolver {
  constructor(@Inject('FIDO2_SERVICE') private f2s: Fido2Service) {}

  @Query()
  async startFidoSetup(@Args('email') email: string) {
    return this.f2s.registration(email);
  }

  @Mutation()
  async respondToFidoSetup(@Args('data') data: any) {
    return this.f2s.completeRegistration(data);
  }
}
