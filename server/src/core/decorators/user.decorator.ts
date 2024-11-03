import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const User = createParamDecorator(
  (prop: string, ctx: ExecutionContext) => {
    let request = ctx.switchToHttp().getRequest();
    if (ctx.getType().toString() === 'graphql') {
      request = GqlExecutionContext.create(ctx).getContext().req;
    }

    const user = request.user;
    return prop ? user?.[prop] : user;
  },
);
