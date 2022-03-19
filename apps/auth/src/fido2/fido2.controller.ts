import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Fido2Service } from './fido2.service';

@Controller('fido2')
export class Fido2Controller {
  constructor(@Inject('FIDO2_SERVICE') private f2s: Fido2Service) {}

  @MessagePattern('fido2_registration')
  async registration(data: any) {
    return this.f2s.registration(data.username, data.displayName, data.id);
  }

  @MessagePattern('fido2_complete_registration')
  async completeRegistration(data: any) {
    return this.f2s.completeRegistration(data);
  }
}
