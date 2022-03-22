import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagesService {
  async getName(): Promise<string> {
    return process.env.INSTANCE_NAME;
  }
}
