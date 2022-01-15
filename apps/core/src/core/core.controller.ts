import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CoreService } from './core.service';

@Controller()
export class CoreController {
  constructor(
    @Inject('CORE_SERVICE') private readonly coreService: CoreService,
  ) {}

  @MessagePattern('instance_info')
  async info() {
    return {
      name: await this.coreService.getName(),
      authMethods: ['password'], // TODO: get methods from auth module, when implemented
    };
  }
}
