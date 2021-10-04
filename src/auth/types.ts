import { OpinsysOauth } from "./oauth2/opinsys.provider";

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  sub: string;
  name: string;
}

export interface Tokens {
  access: {
    secret: string;
    expiresIn: string;
  };
  refresh: {
    secret: string;
    expiresIn: string;
  };
}

export interface SocialUser {
  firstName: string,
  lastName: string,
  id: string,
  provider: Provider
}

// Here "opinsys" because thats the field opinsys is going to be using
export enum Provider {
  OPINSYS = "opinsys"
}
