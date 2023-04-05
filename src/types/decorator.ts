import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { UserRequestType } from '../users/users.types';

export const Cookies = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.cookies?.[data] : request.cookies;
  },
);

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserRequestType => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
export const CurrentUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext): ObjectId => {
    const request = context.switchToHttp().getRequest();
    return request.user.userId;
  },
);
