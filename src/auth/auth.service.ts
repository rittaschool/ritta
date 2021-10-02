import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
import { LoginUserInput } from './dto/login-input.dto';
import { TokenPayload, TokenResponse, Tokens } from './types';
import * as argon2 from 'argon2';
import { Cryptor } from '../utils/encryption.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly cryptor: Cryptor,
  ) {}

  async validate({ username, password }: LoginUserInput): Promise<User> {
    const user = (await this.usersService.findOne(username)) as User;

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const userPassword = this.cryptor.decrypt(user.password)

    if (!(await argon2.verify(userPassword, password || '')))
      throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async login(user: User): Promise<TokenResponse> {
    const payload: TokenPayload = {
      sub: user.id,
      name: user.username,
    };

    return {
      accessToken: await this.jwtService.signAsync(
        payload,
        this.getTokenOptions('access', user),
      ),
      refreshToken: await this.jwtService.signAsync(
        payload,
        this.getTokenOptions('refresh', user),
      ),
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: any) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getTokenOptions(type: 'access' | 'refresh', user: User): JwtSignOptions {
    const tokens = this.configService.get<Tokens>('security.tokens');

    const options: JwtSignOptions = {
      secret: tokens[type].secret + user.secret,
      expiresIn: tokens[type].expiresIn,
    };

    return options;
  }
}
