import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  IEventType,
  ILoginResponse,
  LoginUserDto,
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

  async login(loginUserDto: LoginUserDto): Promise<{
    token: string;
    refreshToken: string;
    type: ILoginResponse;
    user: IUser;
  }> {
    const res = await this.client
      .send(IEventType.USER_LOGIN, loginUserDto)
      .pipe(timeout(10000)) // increased timeout
      .pipe(catchError((val) => of({ error: val.message })))
      .toPromise(); // converting observable to promise

    const user = await this.userService.getUser(loginUserDto.username);

    return {
      user,
      token: res.token,
      refreshToken: res.refreshToken,
      type: res.type,
    };
  }
}
