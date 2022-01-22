import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  RittaError,
  IErrorType,
  Challenge,
  IChallengeType,
  generateChallenge,
  IUser,
} from '@rittaschool/shared';
import { timeout, catchError, of } from 'rxjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_BUS') private client: ClientProxy,
    @Inject('USERS_SERVICE') private readonly userService: UsersService,
  ) {}

  async startLoginProcess(identifier: string): Promise<{
    // token: string;
    // refreshToken: string;
    // type: IRequestType;
    // user: IUser;
    challenge: Challenge;
    userPhotoUri: string;
    userFirstName: string;
  }> {
    const user = await this.userService.getUser(identifier);

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

    return {
      userFirstName: user.firstName,
      userPhotoUri: `https://avatars.dicebear.com/api/bottts/${user.username}.svg`,
      challenge,
    };
  }

  async handleLoginRequest(challenge: Challenge) {
    console.log(challenge);
    let res;

    switch (challenge.type) {
      case IChallengeType.PASSWORD_NEEDED:
        console.log('password needed');
        console.log('pass challenge', challenge);
        res = await this.client
          .send('user_login_password', challenge)
          .pipe(timeout(10000))
          .pipe(catchError((val) => of({ error: val.message })))
          .toPromise();
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
        res = await this.client
          .send('user_login_otp', challenge)
          .pipe(timeout(10000))
          .pipe(catchError((val) => of({ error: val.message })))
          .toPromise();
        break;

      default:
        throw new RittaError(
          'Unknown challenge type',
          IErrorType.UNSUPPORTED_PROVIDER,
        ); //TODO: change to UNSUPPORTED_CHALLENGE and add UNKNOWN
    }

    const response: { user?: IUser; challenge?: Challenge } = {};

    if (res.user) {
      response.user = res.user;
    } else {
      response.challenge = res;
    }

    console.log('response', response);
    console.log('res', res);

    return response;
  }
}
