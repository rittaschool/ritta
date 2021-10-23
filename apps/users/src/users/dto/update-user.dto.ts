import { PartialType } from '@nestjs/mapped-types';
import { IsUUID } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsUUID('4')
  id: string;
}
