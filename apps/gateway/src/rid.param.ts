import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RID = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.getType();
    return 'rid';
  },
);
