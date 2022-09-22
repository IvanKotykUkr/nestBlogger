import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserFromTokenType, UserRequestType } from './types/users.types';
import { JwtService } from './jwt.service';
import { QueryUsersRepositories } from './users/query.users.repositories';
import { ObjectId } from 'mongodb';
import { QueryCommentsRepositories } from './comments/query.comments.repositories';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    protected jwtService: JwtService,
    protected queryUsersRepositories: QueryUsersRepositories,
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
    req.user = await this.findUserById(user.userId);
    return true;
  }

  private async findUserById(userId: ObjectId): Promise<UserRequestType> {
    const user = await this.queryUsersRepositories.findUserById(userId);
    if (typeof user == 'string') {
      throw new UnauthorizedException([
        { message: 'there is no user', field: 'token' },
      ]);
    }
    return user;
  }
}

@Injectable()
export class CheckOwnGuard implements CanActivate {
  constructor(protected queryCommentsRepositories: QueryCommentsRepositories) {}

  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    const userId = req.user.id.toString();
    const commentUserId = await this.queryCommentsRepositories.findCommentsById(
      new ObjectId(req.params.id),
    );
    if (typeof commentUserId == 'string') {
      throw new NotFoundException([{ message: 'no comment', field: 'id' }]);
    }

    if (userId !== commentUserId.toString()) {
      throw new ForbiddenException([
        { message: 'not your own', field: 'user' },
      ]);
    }
    return true;
  }
}
