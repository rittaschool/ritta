import { Injectable } from '@nestjs/common';

@Injectable()
export class InstancesService {
  async getName(): Promise<string> {
    return process.env.INSTANCE_NAME;
  }
}
