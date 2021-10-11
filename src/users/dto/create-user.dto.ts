import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsAscii,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { OAuthIdentifiersDto } from './oauth-identifiers.dto';

@InputType()
export class CreateUserDto {
  @Field()
  @IsString()
  @MinLength(1)
  firstName: string;

  @Field()
  @IsString()
  @MinLength(1)
  lastName: string;

  @Field()
  @IsString()
  @MinLength(8)
  @IsAscii()
  password: string;

  @Field({ nullable: true })
  @IsString()
  @IsAscii()
  username?: string;

  @ApiProperty({ type: OAuthIdentifiersDto })
  oauth2Identifiers: OAuthIdentifiersDto;
}
