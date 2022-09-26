import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserFromTokenType } from './types/users.types';
import { JwtService } from './jwt.service';
import { ObjectId } from 'mongodb';
import { QueryCommentsRepositories } from './comments/query.comments.repositories';
import { GuardHelper } from './guard.helper';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    protected jwtService: JwtService,
    protected guardHelper: GuardHelper,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    if (!req.headers.authorization) {
      throw new UnauthorizedException([
        {
          message: 'there are no authorizations in the header ',
          field: 'headers authorization',
        },
      ]);
    }
    const token: string = req.headers.authorization.split(' ')[1];
    const user: UserFromTokenType | string =
      this.jwtService.getUserIdByAccessToken(token);
    if (typeof user == 'string') {
      throw new UnauthorizedException([
        { message: 'Should be valide JWT Token', field: 'token' },
      ]);
    }
    req.user = await this.guardHelper.findUserById(user.userId);
    return true;
  }
}

@Injectable()
export class CheckOwnGuard implements CanActivate {
  constructor(protected queryCommentsRepositories: QueryCommentsRepositories) {}

  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    const userId = req.user.id.toString();
    const comment = await this.queryCommentsRepositories.findCommentsById(
      new ObjectId(req.params.id),
    );
    if (typeof comment === 'string') {
      throw new NotFoundException([{ message: 'no comment', field: 'id' }]);
    }
    const commentUserId = comment.userId.toString();
    if (userId !== commentUserId.toString()) {
      throw new ForbiddenException([
        { message: 'not your own', field: 'user' },
      ]);
    }
    return true;
  }
}
