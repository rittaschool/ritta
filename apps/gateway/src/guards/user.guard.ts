import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
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
    let token: string;
    let request: any;
    let rid: string;

    switch (context.getType() as any) {
      case 'http':
        request = context.switchToHttp().getRequest();
        token = request.cookies.rif;
        rid = request.rid;
        break;
      case 'graphql':
        request = context.getArgByIndex(2).request;
        token = request.cookies.rif;
        rid = request.rid;
        break;
      default:
        return false;
    }

    // Return true because we want this to be always run
    if (!token) return true;

    const data = this.tokenizer.verify<{
      type: 'access' | 'refresh';
      uid: string;
      exp: number;
      iat: number;
    }>(token);

    const user = await this.userService.getUser(data.uid, rid);

    if (!user) {
      this.logger.error(`User not found for token ${token}`);
      return true;
    }

    request.user = user;

    return true;
  }
}
