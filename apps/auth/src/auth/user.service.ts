import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '@rittaschool/shared';
import { catchError, of } from 'rxjs';

@Injectable()
export class UserService {
  constructor(@Inject('EVENT_BUS') private client: ClientProxy) {}

  findAll(): Promise<User[]> {
    return this.client.send<User[]>('get_users', {}).toPromise();
  }

  findOne(id: string): Promise<User> {
    return this.client
      .send<User>('get_user', { id })
      .pipe(catchError(() => of(null)))
      .toPromise();
  }
}
