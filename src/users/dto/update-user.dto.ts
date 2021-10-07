import { Field, InputType } from '@nestjs/graphql';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import {
  IsAlphanumeric,
  IsAscii,
  IsEmail,
  IsObject,
  IsOptional,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { LocationDtoInput } from '../../utils/dto/location.dto';
import { User } from '../schemas/user.schema';

@InputType()
export class UpdateUserDto extends PartialType(
  OmitType(User, [
    'id',
    'isFirstLogin',
    'accounts',
    'latestLogin',
    'latestPasswordChange',
    'secret',
    'password',
  ]),
) {
  @Field()
  @IsUUID('4')
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsAlphanumeric()
  @MinLength(1)
  @MaxLength(20)
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsAlphanumeric()
  @MinLength(1)
  @MaxLength(20)
  lastName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(20)
  @MinLength(1)
  @IsAlphanumeric()
  alias?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(30)
  @MinLength(3)
  @IsAscii()
  username?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsObject()
  home?: LocationDtoInput;
}
