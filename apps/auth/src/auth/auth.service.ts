import { Inject, Injectable } from '@nestjs/common';
import {
  generateChallenge,
  IChallengeType,
  IErrorType,
  ISocialProvider,
  ITokenType,
  LoginOAuthUserDto,
  RittaError,
  User,
} from '@rittaschool/shared';
import { UserService } from '../common/user.service';
import cryptor from './cryptor';
import mfa from './mfa';
import tokenizer from './tokenizer';

@Injectable()
export class AuthService {
  constructor(@Inject('USERS_SERVICE') private userService: UserService) {}

  async loginWithPassword(password: string, userId: string) {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new RittaError('User not found!', IErrorType.USER_NOT_FOUND);
    }

    const passwordValid = await cryptor.verifyPassword(password, user.password);

    if (!passwordValid) {
      throw new RittaError(
        'Invalid credentials',
        IErrorType.INVALID_CREDENTIALS,
      );
    }

    if (user.mfa.enabled) {
      const challenge = generateChallenge(IChallengeType.OTP_NEEDED, userId);

      return { challenge };
    }

    return await this.generateTokens(user);
  }

  async submitOtpCode(code: string, userId: string) {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new RittaError('User not found!', IErrorType.USER_NOT_FOUND);
    }

    if (!user.mfa.enabled)
      throw new RittaError('MFA not enabled', IErrorType.UNKNOWN); //TODO: change for IErrorType.MFA_NOT_ENABLED

    const isValid = mfa.checkMfaCode(code, user.mfa.secret);

    if (!isValid) {
      throw new RittaError('Invalid MFA code', IErrorType.INVALID_CODE);
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

        const jwt = (await tokenizer.verifyToken(
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

  // async loginMFA(loginMFADto: LoginMFAUserDto) {
  //   const decoded = await tokenizer.verifyToken(loginMFADto.mfaToken);
  //   const user = await this.userService.findOne(
  //     (decoded as { uid: string }).uid,
  //   );

  //   if (!user) {
  //     throw new RittaError('Invalid token', IErrorType.INVALID_TOKEN);
  //   }

  //   const isValid = mfa.checkMfaCode(loginMFADto.mfaCode, user.mfa.secret);

  //   if (!isValid) {
  //     throw new RittaError('Invalid MFA code', IErrorType.INVALID_CODE);
  //   }

  //   return await this.generateTokens(user);
  // }

  private async generateTokens(user: User): Promise<{
    user: User;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    // TODO: implement later after auth works with new system
    // if (user.isPasswordChangeRequired) {
    //   // Password change token
    //   return {
    //     type: ILoginResponse.PWD_CHANGE_REQUIRED,
    //     token: await tokenizer.signToken({
    //       type: ILoginResponse.PWD_CHANGE_REQUIRED,
    //       uid: user.id,
    //     }),
    //   };
    // }

    // return {
    //   type: ILoginResponse.LOGGED_IN,
    //   user,
    //   token: await tokenizer.signToken({
    //     type: ILoginResponse.LOGGED_IN,
    //     uid: user.id,
    //     exp: Math.floor(Date.now() / 1000) + 15 * 60, // Expire access token after 15 minutes
    //   }),
    //   refreshToken: await tokenizer.signToken({
    //     type: ITokenType.REFRESH_TOKEN,
    //     uid: user.id,
    //     exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // Expire refresh token after 30 days (new refresh tokens will be granted when tokens are refreshed)
    //   }),
    // };

    const refreshToken = (await tokenizer.signToken({
      type: ITokenType.REFRESH_TOKEN,
      uid: user.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // Expire refresh token after 30 days (new refresh tokens will be granted when tokens are refreshed)
    })) as string;

    const accessToken = (await tokenizer.signToken({
      type: ITokenType.ACCESS_TOKEN,
      uid: user.id,
      exp: Math.floor(Date.now() / 1000) + 15 * 60, // Expire access token after 15 minutes
    })) as string;

    return {
      user,
      tokens: {
        refreshToken,
        accessToken,
      },
    };
  }
}
