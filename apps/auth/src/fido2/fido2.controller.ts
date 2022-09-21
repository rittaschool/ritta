import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IEventType } from '@rittaschool/shared';
import { Fido2Service } from './fido2.service';

@Controller('fido2')
export class Fido2Controller {
  constructor(@Inject('FIDO2_SERVICE') private f2s: Fido2Service) {}

  @MessagePattern(IEventType.FIDO2_REGISTRATION)
  async registration(data: any) {
    return this.f2s.registration(data.username, data.displayName, data.id);
  }

  @MessagePattern(IEventType.FIDO2_COMPLETE_REGISTRATION)
  async completeRegistration(data: any) {
    return this.f2s.completeRegistration(data);
  }
}
