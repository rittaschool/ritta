import { PartialType } from '@nestjs/mapped-types';
import { CreateSchoolDto } from '@rittaschool/shared';
import { IsUUID } from 'class-validator';

export class UpdateSchoolDto extends PartialType(CreateSchoolDto) {
  @IsUUID('4')
  id?: string;
}
