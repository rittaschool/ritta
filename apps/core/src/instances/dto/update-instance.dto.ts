import { PartialType } from '@nestjs/mapped-types';
import { CreateInstanceDto } from '@rittaschool/shared/src/classes/dto';
import { IsUUID } from 'class-validator';

export class UpdateInstanceDto extends PartialType(CreateInstanceDto) {
  @IsUUID('4')
  id?: string;
}
