import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FilteredUser } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginUserInput } from './dto/login-input.dto';
import { Provider } from './types';

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() loginUserInput: LoginUserInput): Promise<FilteredUser> {
    return this.authService.filterUser(await this.authService.validate(loginUserInput))
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.loginWithThirdParty(Provider[id.toUpperCase()], '12345');
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
