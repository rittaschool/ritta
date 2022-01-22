import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs';

@Injectable()
export class AppService {
  constructor(@Inject('CORE_BUS') private client: ClientProxy) {}

  getHello(): string {
    return '{}';
  }

  async getInfo() {
    return this.client
      .send('instance_info', {})
      .pipe(timeout(5000)) // timeout
      .toPromise();
  }
}
