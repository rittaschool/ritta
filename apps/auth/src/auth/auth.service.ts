import { Inject, Injectable } from '@nestjs/common';
import {
  LoginUserDto,
  LoginOAuthUserDto,
  LoginMFAUserDto,
  User,
  ILoginResponse,
  ISocialProvider,
  RittaError,
  IErrorType,
  ITokenType,
  IPasswordChallengeData,
  IChallengeType,
  IOtpChallengeData,
  generateChallenge,
  ChallengeData,
} from '@rittaschool/shared';
import { UserService } from './user.service';
import cryptor from './cryptor';
import tokenizer from './tokenizer';
import mfa from './mfa';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(@Inject('USERS_SERVICE') private userService: UserService) {}

  // async login(loginUserDto: LoginUserDto) {
  //   // Find user by username or e-mail
  //   const users = await this.userService.findAll();
  //   const user = users.find(
  //     (user) =>
  //       user.email === loginUserDto.username ||
  //       user.username === loginUserDto.username, // Username = E-mail or username :)
  //   );

  //   if (!user) {
  //     throw new RittaError(
  //       'Invalid credentials',
  //       IErrorType.INVALID_CREDENTIALS,
  //     );
  //   }

  //   const passwordValid = await cryptor.verifyPassword(
  //     loginUserDto.password,
  //     user.password,
  //   );

  //   if (!passwordValid) {
  //     throw new RittaError(
  //       'Invalid credentials',
  //       IErrorType.INVALID_CREDENTIALS,
  //     );
  //   }

  //   return await this.generateTokens(user);
  // }

  async loginWithPassword(data: ChallengeData, userId: string) {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new RittaError('User not found!', IErrorType.USER_NOT_FOUND);
    }

    const passwordValid = await cryptor.verifyPassword(
      data.passwordData.password,
      user.password,
    );

    if (!passwordValid) {
      console.log('password not valid');
      throw new RittaError(
        'Invalid credentials',
        IErrorType.INVALID_CREDENTIALS,
      );
    }

    if (user.mfa.enabled) {
      const challenge = generateChallenge(IChallengeType.OTP_NEEDED, userId);

      return challenge;
    }

    return await this.generateTokens(user);
  }

  async submitOtpCode(data: IOtpChallengeData, userId: string) {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new RittaError('User not found!', IErrorType.USER_NOT_FOUND);
    }

    if (!user.mfa.enabled) throw new RpcException('MFA not enabled');

    const isValid = mfa.checkMfaCode(data.otp, user.mfa.secret);

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
