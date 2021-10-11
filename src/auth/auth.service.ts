import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { FilteredUser, UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
import { LoginUserInput } from './dto/login-input.dto';
import {
  Provider,
  TokenPayload,
  TokenResponse,
  Tokens,
  TokenType,
} from './types';
import * as argon2 from 'argon2';
import { Cryptor } from '../utils/encryption.service';
import { Oauth2Service } from './oauth2/oauth2.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly cryptor: Cryptor,
    private readonly oauthService: Oauth2Service,
  ) {}

  async validate({ username, password }: LoginUserInput): Promise<User> {
    const user = (await this.usersService.findOne(username)) as User;

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const userPassword = this.cryptor.decrypt(user.password);

    if (!(await argon2.verify(userPassword, password || '')))
      throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async login(user: User): Promise<TokenResponse> {
    const accessPayload: TokenPayload = {
      sub: user.id,
      type: TokenType.ACCESS,
    };

    const refreshPayload: TokenPayload = {
      sub: user.id,
      type: TokenType.REFRESH,
    };

    return {
      accessToken: await this.jwtService.signAsync(
        accessPayload,
        this.getTokenOptions('access', user),
      ),
      refreshToken: await this.jwtService.signAsync(
        refreshPayload,
        this.getTokenOptions('refresh', user),
      ),
    };
  }

  async loginWithThirdParty(socialProvider: Provider, code: string) {
    if (!socialProvider)
      throw new BadRequestException('Social Provider not provided!');
    if (!code) throw new BadRequestException('Code not present!');

    const { id, provider } = await this.oauthService.verifyCode(
      socialProvider,
      code,
    );
    const user = await this.usersService.findOneWithSocial(provider, id);

    const accessPayload: TokenPayload = {
      sub: user.id,
      type: TokenType.ACCESS,
    };

    const refreshPayload: TokenPayload = {
      sub: user.id,
      type: TokenType.REFRESH,
    };

    return {
      accessToken: await this.jwtService.signAsync(
        accessPayload,
        this.getTokenOptions('access', user),
      ),
      refreshToken: await this.jwtService.signAsync(
        refreshPayload,
        this.getTokenOptions('refresh', user),
      ),
    };
  }

  getTokenOptions(type: 'access' | 'refresh', user: User): JwtSignOptions {
    const tokens = this.configService.get<Tokens>('security.tokens');

    const options: JwtSignOptions = {
      secret: tokens[type].secret + user.secret,
      expiresIn: tokens[type].expiresIn,
    };

    return options;
  }

  filterUser(user: User): Promise<FilteredUser> {
    return this.usersService.filterUser(user);
  }
}
