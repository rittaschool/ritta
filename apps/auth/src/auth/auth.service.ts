import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  LoginUserDto,
  LoginOAuthUserDto,
  LoginMFAUserDto,
  User,
  ILoginResponse,
  ISocialProvider,
  ITokenType,
} from '@rittaschool/shared';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import * as jsonwebtoken from 'jsonwebtoken';
import { totp } from 'otplib';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async login(loginUserDto: LoginUserDto) {
    // Find user by username or e-mail
    const users = await this.userService.findAll();
    const user = users.find(
      (user) =>
        user.email === loginUserDto.username ||
        user.username === loginUserDto.username, // Username = E-mail or username :)
    );

    if (!user) {
      throw new RpcException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!passwordValid) {
      throw new RpcException('Invalid credentials');
    }

    return await this.generateTokens(user);
  }

  async loginOAuth(loginOAuthUserDto: LoginOAuthUserDto) {
    switch (loginOAuthUserDto.provider) {
      case ISocialProvider.OPINSYS:
        if (!process.env.OPINSYS_SECRET) {
          throw new RpcException('Unsupported provider');
        }

        if (!process.env.OPINSYS_ORGANIZATION) {
          throw new RpcException('Unsupported provider');
        }

        const jwt = (await this.verifyToken(
          loginOAuthUserDto.identifier,
          process.env.OPINSYS_SECRET,
        )) as IOpinsysJWT;

        if (jwt.organisation_domain !== process.env.OPINSYS_ORGANIZATION) {
          throw new RpcException('Invalid organization');
        }

        const users = await this.userService.findAll();
        const user = users.find(
          (u) => u.oauth2Identifiers.opinsys === `${jwt.id}`,
        );

        if (!user) {
          throw new RpcException('User not found');
        }

        return await this.generateTokens(user);
      default:
        throw new RpcException('Unsupported provider');
    }
  }

  async loginMFA(loginMFADto: LoginMFAUserDto) {
    const decoded = await this.verifyToken(loginMFADto.mfaToken);
    const user = await this.userService.findOne(
      (decoded as { uid: string }).uid,
    );

    if (!user) {
      throw new RpcException('Invalid token');
    }

    const isValid = totp.check(loginMFADto.mfaCode, user.mfa.secret);

    if (!isValid) {
      throw new RpcException('Invalid MFA code');
    }

    return await this.generateTokens(user, true);
  }

  private async generateTokens(user: User, skipMFA = false) {
    if (user.mfa.enabled && !skipMFA) {
      // Generate MFA tokens
      return {
        type: ITokenType.MFA_TOKEN,
        token: await this.signToken({
          type: ILoginResponse.MFA_REQUIRED,
          uid: user.id,
        }),
      };
    }
    if (user.isPasswordChangeRequired) {
      // Password change token
      return {
        type: ITokenType.PWD_CHANGE_TOKEN,
        token: await this.signToken({
          type: ILoginResponse.PWD_CHANGE_REQUIRED,
          uid: user.id,
        }),
      };
    }
    return {
      type: ILoginResponse.LOGGED_IN,
      accessToken: await this.signToken({
        type: ITokenType.ACCESS_TOKEN,
        uid: user.id,
        exp: Math.floor(Date.now() / 1000) + 15 * 60, // Expire access token after 15 minutes
      }),
      refreshToken: await this.signToken({
        type: ITokenType.REFRESH_TOKEN,
        uid: user.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // Expire refresh token after 30 days (new refresh tokens will be granted when tokens are refreshed)
      }),
    };
  }

  private signToken(payload: Record<string, unknown>) {
    return new Promise((resolve, reject) => {
      jsonwebtoken.sign(payload, process.env.SIGNING_KEY, (err, encoded) => {
        if (err) reject(new RpcException('Invalid token'));
        resolve(encoded);
      });
    });
  }

  private verifyToken(token: string, key = process.env.SIGNING_KEY) {
    return new Promise((resolve, reject) => {
      jsonwebtoken.verify(token, key, (err, decoded) => {
        if (err) reject(new RpcException('Invalid token'));
        resolve(decoded);
      });
    });
  }
}
