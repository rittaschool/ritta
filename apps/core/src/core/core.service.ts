import { Injectable } from '@nestjs/common';

@Injectable()
export class CoreService {
  async getName(): Promise<string> {
    return process.env.INSTANCE_NAME;
  }
}
