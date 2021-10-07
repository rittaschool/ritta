import { Field, InputType } from '@nestjs/graphql';
import { IsAscii, IsString, MinLength } from 'class-validator';

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
}
