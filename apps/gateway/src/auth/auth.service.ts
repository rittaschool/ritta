import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  RittaError,
  IErrorType,
  Challenge,
  IChallengeType,
  generateChallenge,
  IUser,
  User,
  ILoginResponse,
} from '@rittaschool/shared';
import { FastifyReply } from 'fastify';
import { timeout, catchError, of } from 'rxjs';
import { ChallengeService } from '../challenge/challenge.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_BUS') private client: ClientProxy,
    @Inject('USERS_SERVICE') private readonly userService: UsersService,
    @Inject('CHALLENGE_SERVICE') private challengeService: ChallengeService,
  ) {}

  async startLoginProcess(
    identifier: string,
    rid: string,
  ): Promise<{
    // token: string;
    // refreshToken: string;
    // type: IRequestType;
    // user: IUser;
    challenge: Challenge;
    userPhotoUri: string;
    userFirstName: string;
  }> {
    const user = await this.userService.getUser(identifier, rid);

    // return {
    //   user,
    //   token: res.token,
    //   refreshToken: res.refreshToken,
    //   type: res.type,
    // };

    if ((user as any).error) {
      throw new RittaError('User not found!', IErrorType.USER_NOT_FOUND);
    }

    let challenge: Challenge;

    if (user.yubikey.enabled) {
      challenge = generateChallenge(IChallengeType.FIDO2_NEEDED, user.id);
    } else {
      challenge = generateChallenge(IChallengeType.PASSWORD_NEEDED, user.id);
    }

    this.challengeService.storeChallenge(challenge);

    return {
      userFirstName: user.firstName,
      userPhotoUri: `https://avatars.dicebear.com/api/bottts/${user.username}.svg`,
      challenge,
    };
  }

  async handleLoginRequest(challenge: Challenge, reply: FastifyReply) {
    let res: SuccessfulLoginResponse;

    switch (challenge.type) {
      case IChallengeType.PASSWORD_NEEDED:
        res = (await this.client
          .send('user_login_password', challenge)
          .pipe(timeout(10000))
          .pipe(catchError((val) => of({ error: val.message })))
          .toPromise()) as SuccessfulLoginResponse;
        break;
      case IChallengeType.FIDO2_NEEDED:
        console.log('fido2 needed');
        throw new RittaError(
          'Not supported, FIDO2',
          IErrorType.UNSUPPORTED_PROVIDER,
        );
        break;
      case IChallengeType.OTP_NEEDED:
        console.log('otp needed');
        res = (await this.client
          .send('user_login_otp', challenge)
          .pipe(timeout(10000))
          .pipe(catchError((val) => of({ error: val.message })))
          .toPromise()) as SuccessfulLoginResponse;
        break;

      default:
        throw new RittaError(
          'Unknown challenge type',
          IErrorType.UNSUPPORTED_PROVIDER,
        ); //TODO: change to UNSUPPORTED_CHALLENGE and add UNKNOWN
    }

    const response: {
      user?: IUser;
      challenge?: Challenge;
      accessToken?: string;
    } = {};

    if (res.user && res.tokens) {
      response.user = res.user;
      response.accessToken = res.tokens.accessToken;

      reply.setCookie('rif', res.tokens.refreshToken, {
        httpOnly: true,
        //domain: ".ritta.fi" . means every subdomain //TODO: use in production
        maxAge: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, //30 days
      });
    } else {
      response.challenge = res.challenge;
    }

    return response;
  }
}

interface SuccessfulLoginResponse {
  type: ILoginResponse;
  user?: IUser;
  tokens?: { accessToken: string; refreshToken: string };
  challenge?: Challenge;
}
