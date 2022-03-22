import { Injectable } from '@nestjs/common';

@Injectable()
export class AnnouncementsService {
  async getName(): Promise<string> {
    return process.env.INSTANCE_NAME;
  }
}
