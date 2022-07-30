import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUser } from '@rittaschool/shared';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    let user: IUser;

    switch (ctx.getType() as any) {
      case 'http':
        user = ctx.switchToHttp().getRequest().user;
        break;

      case 'graphql':
        user = ctx.getArgByIndex(2).req.user;
        break;

      default:
        break;
    }

    return user;
  },
);
