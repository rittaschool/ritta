import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InstancesService } from './instances.service';
import { IEventType } from '@rittaschool/shared';
@Controller()
export class InstancesController {
  constructor(
    @Inject('INSTANCES_SERVICE')
    private readonly instancesService: InstancesService,
  ) {}

  @MessagePattern(IEventType.INSTANCE_INFO)
  async info() {
    return {
      name: await this.instancesService.getName(),
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
