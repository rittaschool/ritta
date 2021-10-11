import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserInput, OAuthUserInput } from './dto/login-input.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { Provider } from './types';

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiOperation({ summary: 'Use username/email & password for authentication' })
  async login(
    @Body() loginUserInput: LoginUserInput,
  ): Promise<LoginResponseDto> {
    return this.authService.login(
      await this.authService.validate(loginUserInput),
    );
  }

  @Post('/oauth')
  @ApiOperation({ summary: 'Use an oauth code to login' })
  findOne(@Body() oauthUserInput: OAuthUserInput): Promise<LoginResponseDto> {
    return this.authService.loginWithThirdParty(
      Provider[oauthUserInput.providerId.toUpperCase()],
      oauthUserInput.code,
    );
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: any) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
