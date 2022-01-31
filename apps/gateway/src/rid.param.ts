import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RID = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    let rid: string;

    switch (ctx.getType() as any) {
      case 'http':
        rid = ctx.switchToHttp().getRequest().rid;
        break;

      case 'graphql':
        rid = ctx.getArgByIndex(2).rid;
        break;

      default:
        break;
    }

    return rid;
  },
);
