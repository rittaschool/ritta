import { IsString, Length, MinLength } from 'class-validator';

export class LocationDto {
  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  postalCode: string;
}
