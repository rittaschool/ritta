import { Injectable } from '@nestjs/common';

@Injectable()
export class SchoolsService {
  async getName(): Promise<string> {
    return process.env.INSTANCE_NAME;
  }
}
