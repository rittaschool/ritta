import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { IErrorType, RittaError } from '@rittaschool/shared';
import { UsersService } from '../users/users.service';
import { Tokenizer } from '../validation/tokenizer';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    @Inject('USERS_SERVICE') private userService: UsersService,
    @Inject('LOGGER') private logger: Logger,
    @Inject('TOKENIZER') private tokenizer: Tokenizer,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get the token, switch because its diffrent for graphql and rest (possibly websockets)
    let request: any;

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

    // Return true because we want this to be always run
    if (!token) return true;
    try {
      const data = await this.tokenizer.verify<{
        type: 'access' | 'refresh';
        uid: string;
        exp: number;
        iat: number;
      }>(token);

      // Return true because we want this to be always run, even if the token is invalid
      if (!data) return true;

      const user = await this.userService.getUser(data.uid, false, rid);

      if (user == null || !user) {
        this.logger.error({
          context: 'UserGuard',
          message: `User not found for token ${token.substring(0, 10)}...`,
        });
        return true;
      }

      request.user = user;

      return true;
    } catch (e) {
      if (e.name === 'RittaException') throw e;
      throw new UnauthorizedException('Invalid token');
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
