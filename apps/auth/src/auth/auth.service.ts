import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  LoginUserDto,
  LoginOAuthUserDto,
  LoginMFAUserDto,
  User,
  ILoginResponse,
  ISocialProvider,
  RittaError,
  IErrorType,
} from '@rittaschool/shared';
import { UserService } from './user.service';
import cryptor from './cryptor';
import tokens from './tokens';
import mfa from './mfa';

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
      throw new RittaError(
        'Invalid credentials',
        IErrorType.INVALID_CREDENTIALS,
      );
    }

    const passwordValid = await cryptor.verifyPassword(
      loginUserDto.password,
      user.password,
    );

    if (!passwordValid) {
      throw new RittaError(
        'Invalid credentials',
        IErrorType.INVALID_CREDENTIALS,
      );
    }

    return await this.generateTokens(user);
  }

  async loginOAuth(loginOAuthUserDto: LoginOAuthUserDto) {
    switch (loginOAuthUserDto.provider) {
      case ISocialProvider.OPINSYS:
        if (!process.env.OPINSYS_SECRET) {
          throw new RittaError(
            'Unsupported provider',
            IErrorType.UNSUPPORTED_PROVIDER,
          );
        }

        if (!process.env.OPINSYS_ORGANIZATION) {
          throw new RittaError(
            'Unsupported provider',
            IErrorType.UNSUPPORTED_PROVIDER,
          );
        }

        const jwt = (await tokens.verifyToken(
          loginOAuthUserDto.identifier,
          process.env.OPINSYS_SECRET,
        )) as IOpinsysJWT;

        if (jwt.organisation_domain !== process.env.OPINSYS_ORGANIZATION) {
          throw new RittaError(
            'Invalid organization',
            IErrorType.INVALID_ORGANIZATION,
          );
        }

        const users = await this.userService.findAll();
        const user = users.find(
          (u) => u.oauth2Identifiers.opinsys === `${jwt.id}`,
        );

        if (!user) {
          throw new RittaError('User not found', IErrorType.USER_NOT_FOUND);
        }

        return await this.generateTokens(user);
      default:
        throw new RittaError(
          'Unsupported provider',
          IErrorType.UNSUPPORTED_PROVIDER,
        );
    }
  }

  async loginMFA(loginMFADto: LoginMFAUserDto) {
    const decoded = await tokens.verifyToken(loginMFADto.mfaToken);
    const user = await this.userService.findOne(
      (decoded as { uid: string }).uid,
    );

    if (!user) {
      throw new RittaError('Invalid token', IErrorType.INVALID_TOKEN);
    }

    const isValid = mfa.checkMfaCode(loginMFADto.mfaCode, user.mfa.secret);

    if (!isValid) {
      throw new RittaError('Invalid MFA code', IErrorType.INVALID_TOKEN); // TODO: change in shared@0.0.20 to INVALID_MFA_CODE
    }

    return await this.generateTokens(user, true);
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
