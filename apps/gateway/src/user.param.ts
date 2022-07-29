import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { IUser } from '@rittaschool/shared';
import jwt from 'jsonwebtoken';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    let user: IUser;

    switch (ctx.getType() as any) {
      case 'http':
        user = ctx.switchToHttp().getRequest().user;
        break;

      case 'graphql':
        const access_token = ctx
          .getArgByIndex(2)
          .request.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(
          access_token,
          process.env.JWT_SIGNING_SECRET,
        );

        if (!decoded) throw new UnauthorizedException('Not logged in...');

        user = decoded as any; //TODO: fix, doesnt work, you need to get users service here somehow to get user

        break;

      default:
        break;
    }

    return user;
  },
);
