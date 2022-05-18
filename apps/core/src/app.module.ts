import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validate } from './validation/env.validation';
import { CoreModule } from './core/core.module';
import { InstancesModule } from './instances/instances.module';
import { SchoolsModule } from './schools/schools.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    CoreModule,
    SchoolsModule,
    InstancesModule,
  ],
})
export class AppModule {}
