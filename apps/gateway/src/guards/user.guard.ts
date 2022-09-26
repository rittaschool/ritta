import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IErrorType, RittaError } from '@rittaschool/shared';
import { UsersService } from '../users/users.service';
import { Tokenizer } from '../validation/tokenizer';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    @Inject('USERS_SERVICE') private userService: UsersService,
    @Inject('LOGGER') private logger: Logger,
    @Inject('TOKENIZER') private tokenizer: Tokenizer,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get the token, switch because its diffrent for graphql and rest (possibly websockets)
    let request: any;
    const noAuthRequired =
      this.reflector.get<boolean | undefined>('noAuth', context.getHandler()) ||
      false;

    switch (context.getType() as any) {
      case 'http':
        request = context.switchToHttp().getRequest();
        break;
      case 'graphql':
        request = context.getArgByIndex(2).request;
        break;
      default:
        return false;
    }

    const rid = request.rid;
    const token = getToken(request);
    const accountID = getAccountID(request);
    if (!token || !accountID) {
      if (noAuthRequired) return true;
      throw new UnauthorizedException('Account header missing');
    } // No Auth Required is returned, because if it is not required, we would return true anyway
    try {
      const data = await this.tokenizer.verify<{
        type: 'access' | 'refresh';
        uid: string;
        exp: number;
        iat: number;
      }>(token);

      if (!data) {
        if (noAuthRequired) return true;
        throw new RittaError(
          'Invalid authentication token',
          IErrorType.AUTHORIZATION_ERROR,
        );
      }

      const user = await this.userService.getUser(data.uid, false, rid);
      if (user == null || !user) {
        this.logger.error({
          context: 'UserGuard',
          message: `User not found for token ${token.substring(0, 10)}`,
        });
        if (noAuthRequired) return true;
        throw new RittaError(
          'Invalid authentication token',
          IErrorType.AUTHORIZATION_ERROR,
        );
      }

      const account = user.accounts.find(
        (acc) => (acc as any)._id === accountID,
      );

      if (account == null || !account) {
        this.logger.error({
          context: 'UserGuard',
          message: `Account doesn't exist on user ${user.id}`,
        });
        if (noAuthRequired) return true;
        throw new RittaError(
          'Request account not found',
          IErrorType.REQUEST_ACCOUNT_NOT_FOUND,
        );
      }

      request.user = user;
      request.account = account;
      return true;
    } catch (e) {
      if (e.name === 'RittaException') throw e;
      // Fallback to general error (most likely expired token)
      throw new RittaError(
        'Invalid authentication token',
        IErrorType.AUTHORIZATION_ERROR,
      );
    }
  }
}

const getToken = (request: any) => {
  if (!request || !request.headers || !request.headers.authorization)
    return null;

  const [bearer, token] = request.headers.authorization.split(' ');

  if (bearer !== 'Bearer') return null;

  return token || null;
};

const getAccountID = (request: any) => {
  if (!request || !request.headers || !request.headers.account) return null;

  return request.headers.account || null;
};
