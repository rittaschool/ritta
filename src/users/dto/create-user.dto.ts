import { IsAlphanumeric, IsAscii, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  firstName: string;

  @IsString()
  @MinLength(1)
  lastName: string;

  @IsString()
  @MinLength(10)
  @IsAscii()
  password: string;

  @IsString()
  @IsAlphanumeric()
  username?: string
}
