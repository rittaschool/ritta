import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAccount } from '@rittaschool/shared';

export const Account = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    let account: IAccount;

    switch (ctx.getType() as any) {
      case 'http':
        account = ctx.switchToHttp().getRequest().account;
        break;

      case 'graphql':
        account = ctx.getArgByIndex(2).req.account;
        break;

      default:
        break;
    }

    return account;
  },
);
