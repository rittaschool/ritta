import { Injectable } from '@nestjs/common';
import { Provider, SocialUser } from '../types';
import { OpinsysOauth } from './opinsys.provider';

@Injectable()
export class Oauth2Service {
  constructor(private readonly opinsysOauth: OpinsysOauth) {}

  getAuthorizationUri(provider: Provider): string {
    switch (Provider[provider.toUpperCase()]) {
      case Provider.OPINSYS: {
        return this.opinsysOauth.getAuthorizationUri();
      }
      default:
        throw new Error('Social Provider not found!');
    }
  }

  async verifyCode(provider: Provider, code: string): Promise<SocialUser> {
    switch (provider) {
      case Provider.OPINSYS:
        return this.opinsysOauth.getUser({ code });
    }
  }
}
