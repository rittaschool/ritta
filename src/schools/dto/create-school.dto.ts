import { IsString, Length, MinLength } from 'class-validator';

export class CreateSchoolDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @Length(5)
  schoolIdentifier: string;
}
