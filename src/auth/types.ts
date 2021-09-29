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
