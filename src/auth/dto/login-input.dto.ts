import { Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { Provider } from '../types';

export class LoginUserInput {
  username: string;
  password: string;
}

export class OAuthUserInput {
  @Field()
  @IsEnum(Provider)
  @ApiProperty({
    description: 'Third party oauth provider ID',
    example: 'opinsys',
  })
  providerId: Provider;

  @Field()
  @IsString()
  @ApiProperty({
    description: 'Third party oauth code/token',
    example: '123456',
  })
  code: string;
}
