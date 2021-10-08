import { IsArray, IsEmail, IsString, Length, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
<<<<<<< HEAD
import { LocationDto } from '../../utils/dto/location.dto';
=======
import { LocationDto } from 'src/utils/dto/location.dto';
>>>>>>> 88c3101501274977b8753f8a5b14d8929a97df1f
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
