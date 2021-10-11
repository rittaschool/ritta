import { SocialUser } from '../types';

export abstract class Oauth2Provider {
  abstract getUser({ code }: { code: string }): Promise<SocialUser>;

  abstract getAuthorizationUri(): string;
}
