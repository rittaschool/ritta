import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CoreService } from './core.service';
import { IEventType } from '@rittaschool/shared';
@Controller()
export class CoreController {
  constructor(
    @Inject('CORE_SERVICE') private readonly coreService: CoreService,
  ) {}

  @MessagePattern(IEventType.INSTANCE_INFO)
  async info() {
    return {
      name: await this.coreService.getName(),
      authMethods: ['password'], // TODO: get methods from auth module, when implemented
    };
  }

  @MessagePattern(IEventType.STATUS)
  async status() {
    return {
      status: 'ok',
    };
  }
}
