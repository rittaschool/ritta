import { IsArray, IsEmail, IsString, Length, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LocationDto } from 'src/utils/dto/location.dto';
export class CreateSchoolDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @Length(5)
  schoolIdentifier?: string = '00000';

  @ApiProperty({ type: LocationDto })
  location: LocationDto;

  @IsEmail()
  email?: string;

  @IsArray()
  modules: string[] = [];
}
