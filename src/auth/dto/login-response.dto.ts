import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginResponseDto {
  @ApiProperty({
    description: 'Access token, JWT',
  })
  @IsString()
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token, JWT',
  })
  @IsString()
  refreshToken: string;
}
