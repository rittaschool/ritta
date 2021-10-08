<<<<<<< HEAD
import { OpinsysOauth } from './oauth2/opinsys.provider';
=======
import { OpinsysOauth } from "./oauth2/opinsys.provider";
>>>>>>> 88c3101501274977b8753f8a5b14d8929a97df1f

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
<<<<<<< HEAD
  firstName: string;
  lastName: string;
  id: string;
  provider: Provider;
=======
  firstName: string,
  lastName: string,
  id: string,
  provider: Provider
>>>>>>> 88c3101501274977b8753f8a5b14d8929a97df1f
}

// Here "opinsys" because thats the field opinsys is going to be using
export enum Provider {
<<<<<<< HEAD
  OPINSYS = 'opinsys',
=======
  OPINSYS = "opinsys"
>>>>>>> 88c3101501274977b8753f8a5b14d8929a97df1f
}
