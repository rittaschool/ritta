import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IEventType, ILoginResponse, LoginUserDto } from '@rittaschool/shared';
import { timeout, catchError, of } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH_BUS') private client: ClientProxy) {}

  async login(
    loginUserDto: LoginUserDto,
  ): Promise<{ token: string; refreshToken: string; type: ILoginResponse }> {
    return this.client
      .send(IEventType.USER_LOGIN, loginUserDto)
      .pipe(timeout(10000)) // increased timeout
      .pipe(catchError((val) => of({ error: val.message })))
      .toPromise(); // converting observable to promise
  }
}
