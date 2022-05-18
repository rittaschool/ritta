import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SchoolsService } from './schools.service';
import { IEventType } from '@rittaschool/shared';
@Controller()
export class SchoolsController {
  constructor(
    @Inject('SCHOOLS_SERVICE')
    private readonly schoolsService: SchoolsService,
  ) {}

  @MessagePattern('instance_info')
  async info() {
    return {
      name: await this.schoolsService.getName(),
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
