import { IsPostalCode, IsString, Length } from 'class-validator';

export class LocationDto {
  @IsString()
  @Length(2, 50)
  address: string;

  @Length(2, 50)
  @IsString()
  city: string;

  @IsPostalCode('FI')
  postalCode: string;
}
