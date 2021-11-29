import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '@rittaschool/shared';
import { IsUUID } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsUUID('4')
  id: string;
}
