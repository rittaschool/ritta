import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IEventType } from '@rittaschool/shared';
import { User } from '@rittaschool/shared';
import { catchError, of } from 'rxjs';

@Injectable()
export class UserService {
  constructor(@Inject('EVENT_BUS') private client: ClientProxy) {}

  findAll(): Promise<User[]> {
    return this.client
      .send<User[]>(IEventType.GET_USERS, {
        server: true,
      })
      .toPromise();
  }

  findOne(id: string): Promise<User> {
    return this.client
      .send<User>(IEventType.GET_USER, { id })
      .pipe(catchError(() => of(null)))
      .toPromise();
  }
}
