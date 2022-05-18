import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validate } from './validation/env.validation';
import { CoreModule } from './core/core.module';
import { InstancesModule } from './instances/instances.module';
import { SchoolsModule } from './schools/schools.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    CoreModule,
    SchoolsModule,
    InstancesModule,
  ],
})
export class AppModule {}
