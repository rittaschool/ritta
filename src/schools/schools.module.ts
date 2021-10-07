import { Module } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { SchoolsController } from './schools.controller';

@Module({
  controllers: [SchoolsController],
  providers: [SchoolsService],
})
export class SchoolsModule {}
