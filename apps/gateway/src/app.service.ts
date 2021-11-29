import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IEventType } from '@rittaschool/shared';

@Injectable()
export class AppService {
  constructor(@Inject('EVENT_BUS') private readonly client: ClientProxy) {}

  getHello(): string {
    return 'Hello World!';
  }

  user(): string {
    this.client.emit<string>(IEventType.USER_CREATED, 'new user midka');
    return 'Event sent successfully';
  }
}
