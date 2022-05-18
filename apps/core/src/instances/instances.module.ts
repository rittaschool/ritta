import { Module } from '@nestjs/common';
import { InstancesService } from './instances.service';
import { InstancesController } from './instances.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Instance } from '@rittaschool/shared';
import { InstanceSchema } from './entities/instance.entity';
import { InstancesRepository } from './instances.repository';

@Module({
  controllers: [InstancesController],
  imports: [
    MongooseModule.forFeature([
      { name: Instance.name, schema: InstanceSchema },
    ]),
    ConfigModule,
  ],
  providers: [
    {
      provide: 'INSTANCES_SERVICE',
      useClass: InstancesService,
    },
    {
      provide: 'INSTANCES_REPOSITORY',
      useClass: InstancesRepository,
    },
  ],
})
export class InstancesModule {}
