import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  Challenge,
  generateChallenge,
  IChallengeType,
  IErrorType,
  ILoginResponse,
  IUser,
  RittaError,
} from '@rittaschool/shared';
import { FastifyReply } from 'fastify';
import { catchError, of, timeout } from 'rxjs';
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
    const user = await this.userService.getUser(identifier, true, rid);

    console.log(user);

    if ((user as any).error) {
      throw new RittaError('User not found!', IErrorType.USER_NOT_FOUND);
    }

    let challenge: Challenge;

    if (user.fido.enabled) {
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

    const isChallengeValid = await this.challengeService.getChallenge(
      challenge.id,
    );

    if (!isChallengeValid) {
      throw new RittaError(
        'Challenge not found or it has expired!',
        IErrorType.INVALID_CODE, //TODO: CHALLENGE_NOT_FOUND
      );
    }

    // Make sure that the type matches
    if (isChallengeValid.type !== challenge.type) {
      throw new RittaError(
        'Challenge type does not match!',
        IErrorType.INVALID_CODE,
      );
    } else if (isChallengeValid.userId !== challenge.userId) {
      throw new RittaError(
        'Challenge userId does not match!',
        IErrorType.INVALID_CODE,
      );
    }

    console.log('HERE?????? ----');
    switch (challenge.type) {
      case IChallengeType.PASSWORD_NEEDED:
        res = (await this.client
          .send('user_login_password', challenge)
          .pipe(timeout(10000))
          .pipe(
            catchError((val) => {
              console.log('val', val);
              return of({ error: val.message });
            }),
          )
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
      access_token?: string;
      refresh_token?: string;
    } = {};

    if (res.user && res.tokens) {
      response.user = res.user;
      response.access_token = res.tokens.accessToken;
      response.refresh_token = res.tokens.refreshToken;
    } else if (res.challenge) {
      response.challenge = res.challenge;
      await this.challengeService.storeChallenge(res.challenge);
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
