import { Module } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { SchoolsController } from './schools.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SchoolSchema } from './entities/school.entity';
import { SchoolsRepository } from './schools.repository';
import { School } from '@rittaschool/shared';

@Module({
  controllers: [SchoolsController],
  imports: [
    MongooseModule.forFeature([{ name: School.name, schema: SchoolSchema }]),
    ConfigModule,
  ],
  providers: [
    {
      provide: 'SCHOOLS_SERVICE',
      useClass: SchoolsService,
    },
    {
      provide: 'SCHOOLS_REPOSITORY',
      useClass: SchoolsRepository,
    },
  ],
})
export class SchoolsModule {}
