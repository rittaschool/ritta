import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(@Inject('EVENT_BUS') private readonly client: ClientProxy) {}

  getHello(): string {
    return 'Hello World!';
  }
}
