import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  LoginUserDto,
  LoginOAuthUserDto,
  LoginMFAUserDto,
  User,
  ILoginResponse,
} from '@rittaschool/shared';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import * as jsonwebtoken from 'jsonwebtoken';
import { totp } from 'otplib';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async login(loginUserDto: LoginUserDto) {
    // Find user by username or e-mail
    const users = await this.userService.findAll();
    const user = users.find(
      (user) =>
        user.email === loginUserDto.username ||
        user.username === loginUserDto.username, // Username = E-mail or username :)
    );

    if (!user) {
      throw new RpcException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!passwordValid) {
      throw new RpcException('Invalid credentials');
    }

    return await this.generateTokens(user);
  }

  async loginOAuth(loginOAuthUserDto: LoginOAuthUserDto) {
    // TODO: Implement this
    return this.userService.findAll();
  }

  async loginMFA(loginMFADto: LoginMFAUserDto) {
    const decoded = await this.verifyToken(loginMFADto.mfaToken);
    const user = await this.userService.findOne(
      (decoded as { uid: string }).uid,
    );

    if (!user) {
      throw new RpcException('Invalid token');
    }

    const isValid = totp.check(loginMFADto.mfaCode, user.mfa.secret);

    if (!isValid) {
      throw new RpcException('Invalid MFA code');
    }

    return await this.generateTokens(user, true);
  }

  private async generateTokens(user: User, skipMFA = false) {
    if (user.mfa.enabled && !skipMFA) {
      // Generate MFA tokens
      return {
        type: ILoginResponse.MFA_REQUIRED,
        token: await this.signToken({
          type: ILoginResponse.MFA_REQUIRED,
          uid: user.id,
        }),
      };
    }
    if (user.isPasswordChangeRequired) {
      // Password change token
      return {
        type: ILoginResponse.PWD_CHANGE_REQUIRED,
        token: await this.signToken({
          type: ILoginResponse.PWD_CHANGE_REQUIRED,
          uid: user.id,
        }),
      };
    }
    return {
      type: ILoginResponse.LOGGED_IN,
      token: await this.signToken({
        type: ILoginResponse.LOGGED_IN,
        uid: user.id,
      }),
    };
  }

  private signToken(payload: Record<string, unknown>) {
    return new Promise((resolve, reject) => {
      jsonwebtoken.sign(payload, process.env.SIGNING_KEY, (err, encoded) => {
        if (err) reject(err);
        resolve(encoded);
      });
    });
  }

  private verifyToken(token: string) {
    return new Promise((resolve, reject) => {
      jsonwebtoken.verify(token, process.env.SIGNING_KEY, (err, decoded) => {
        if (err) reject(err);
        resolve(decoded);
      });
    });
  }
}
