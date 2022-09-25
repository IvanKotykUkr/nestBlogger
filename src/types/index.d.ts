import { UserRequestType } from './users.types';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

declare global {
  declare namespace Express {
    export interface Request {
      user: UserRequestType | null;
    }
  }
}

export const Cookies = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.cookies?.[data] : request.cookies;
  },
);
