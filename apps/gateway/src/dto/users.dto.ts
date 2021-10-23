import { IOAuth2Identifiers } from '@rittaschool/shared';
import {
  MinLength,
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsNotEmptyObject,
  IsOptional,
  IsObject,
} from 'class-validator';
import { Location } from '../entities/classes';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  firstName: string;

  @IsString()
  @MinLength(3)
  lastName: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsPhoneNumber('FI')
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  username?: string;

  @IsString()
  @MinLength(3)
  @IsOptional()
  alias?: string;

  @IsNotEmptyObject()
  @IsOptional()
  home?: Location;

  @IsObject()
  @IsOptional()
  oauth2Identifiers?: IOAuth2Identifiers;
}
