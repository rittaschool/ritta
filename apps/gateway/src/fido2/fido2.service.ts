import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { IErrorType, RittaError } from '@rittaschool/shared';
import { timeout, catchError, of } from 'rxjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class Fido2Service {
  constructor(
    @Inject('AUTH_BUS') private client: ClientProxy,
    @Inject('USERS_SERVICE') private readonly userService: UsersService,
    @Inject(ConfigService) private configService: ConfigService,
  ) {}

  async registration(id: string) {
    const user = await this.userService.getUser(id, false, 'rid later');

    if (!user)
      throw new RittaError('User not found.', IErrorType.USER_NOT_FOUND);

    const data = {
      username: user.username || user.email,
      displayName: user.firstName + ' ' + user.lastName,
      id,
    };

    const response = await this.client
      .send<any>('fido2_registration', data)
      .pipe(timeout(10000))
      .pipe(catchError((val) => of({ error: val.message })))
      .toPromise();

    return response;
  }

  async completeRegistration(data: any) {
    if (data.type != 'public-key')
      throw new RittaError(
        'Invalid type. Only public-key is supported!',
        IErrorType.UNKNOWN,
      );

    let clientData = JSON.parse(
      Buffer.from(data.response.clientDataJSON, 'base64').toString(),
    );

    // Verify that origin is the same
    if (clientData.origin != this.configService.get('FRONTEND_PUBLIC_URL'))
      throw new RittaError('Invalid origin.', IErrorType.UNKNOWN);

    const response = await this.client
      .send<any>('fido2_complete_registration', data)
      .pipe(timeout(10000))
      .pipe(catchError((val) => of({ error: val.message })))
      .toPromise();

    console.log(response);

    return true;
  }
}
