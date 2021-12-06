import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  LoginUserDto,
  LoginOAuthUserDto,
  LoginMFAUserDto,
  User,
  ILoginResponse,
  ISocialProvider,
} from '@rittaschool/shared';
import { UserService } from './user.service';
import { totp } from 'otplib';
import cryptor from './cryptor';
import tokens from './tokens';

@Injectable()
export class AuthService {
  constructor(@Inject('USERS_SERVICE') private userService: UserService) {}

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

    const passwordValid = await cryptor.verifyPassword(
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

        const jwt = (await tokens.verifyToken(
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
    try {
      const decoded = await tokens.verifyToken(loginMFADto.mfaToken);
      const user = await this.userService.findOne(
        (decoded as { uid: string }).uid,
      );

      if (!user) {
        throw new Error('Invalid token');
      }

      const isValid = totp.check(loginMFADto.mfaCode, user.mfa.secret);

      if (!isValid) {
        throw new Error('Invalid MFA code');
      }

      return await this.generateTokens(user, true);
    } catch (error) {
      console.log(error);
      throw new RpcException(error);
    }
  }

  private async generateTokens(user: User, skipMFA = false) {
    if (user.mfa.enabled && !skipMFA) {
      // Generate MFA tokens
      return {
        type: ILoginResponse.MFA_REQUIRED,
        token: await tokens.signToken({
          type: ILoginResponse.MFA_REQUIRED,
          uid: user.id,
        }),
      };
    }
    if (user.isPasswordChangeRequired) {
      // Password change token
      return {
        type: ILoginResponse.PWD_CHANGE_REQUIRED,
        token: await tokens.signToken({
          type: ILoginResponse.PWD_CHANGE_REQUIRED,
          uid: user.id,
        }),
      };
    }
    return {
      type: ILoginResponse.LOGGED_IN,
      token: await tokens.signToken({
        type: ILoginResponse.LOGGED_IN,
        uid: user.id,
      }),
    };
  }
}
