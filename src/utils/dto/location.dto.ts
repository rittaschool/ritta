import { Field, ObjectType } from '@nestjs/graphql';
import { IsPostalCode, IsString, Length } from 'class-validator';

@ObjectType()
export class LocationDto {
  @Field()
  @IsString()
  @Length(2, 50)
  address: string;

  @Field()
  @Length(2, 50)
  @IsString()
  city: string;

  @Field()
  @IsPostalCode('FI')
  postalCode: string;
}
