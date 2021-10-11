import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class OAuthIdentifiersDto {
  @Field()
  @IsString()
  @IsOptional()
  opinsys?: string;
}
