import { Field, InputType, ObjectType } from '@nestjs/graphql';
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

@InputType()
export class LocationDtoInput {
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
