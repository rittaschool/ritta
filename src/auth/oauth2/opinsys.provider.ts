import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Provider, SocialUser } from '../types';
import { Oauth2Provider } from './provider.implementation';
import { verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

function decodeJWT(jwt, secret): Promise<{ [key: string]: any }> {
  return new Promise((resolve, reject) => {
    verify(jwt, secret, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
}
@Injectable()
export class OpinsysOauth implements Oauth2Provider {
  private configService: ConfigService;
  constructor(private configurationService: ConfigService) {
    this.configService = configurationService;
  }

  getAuthorizationUri(): string {
    throw new Error('Method not implemented.');
  }

  async getUser({ code }: { code: string }): Promise<SocialUser> {
    // Code = jwt token
    if (!this.configService.get<boolean>('oauth.opinsys.enabled')) {
      throw new HttpException(
        'Authentication method not enabled',
        HttpStatus.FORBIDDEN,
      );
    }
    try {
      const userData = await decodeJWT(
        code,
        this.configService.get<string>('oauth.opinsys.secret'),
      );
      if (
        userData.organisation_domain !==
        this.configService.get<string>('oauth.opinsys.organization')
      ) {
        throw new HttpException(
          'User organization invalid',
          HttpStatus.FORBIDDEN,
        );
      }
      return {
        firstName: userData.first_name,
        lastName: userData.last_name,
        id: userData.puavo_id.toString(),
        provider: Provider.OPINSYS,
      };
    } catch (e) {
      // Let's just give an simple error with more info?
      throw new HttpException('Authentication error', HttpStatus.FORBIDDEN);
    }
    //throw new Error("Method not implemented. code: " + code);
  }
}
