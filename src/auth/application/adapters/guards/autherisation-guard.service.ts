import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { CommentsRepositories } from '../../../../comments/infrastructure/comments.repositories';
import { JwtService } from '@nestjs/jwt';
import process from 'process';
import { BloggersRepositories } from '../../../../bloggers/infrastructure/bloggers.repositories';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(protected jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    const token = this.takeTokenFromHeader(req.headers.authorization);
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.ACCESS_JWT_SECRET,
      });
      req.userId = payload.userId;
    } catch {
      throw new UnauthorizedException({
        message: 'Should be valide JWT Token',
        field: 'token',
      });
    }
    return true;
  }

  private takeTokenFromHeader(headers: string) {
    if (!headers) {
      throw new UnauthorizedException([
        {
          message: 'there are no authorizations in the header ',
          field: 'headers authorization',
        },
      ]);
    }
    return headers.split(' ')[1];
  }
}

@Injectable()
export class CheckOwnGuard implements CanActivate {
  constructor(protected commentsRepositories: CommentsRepositories) {}

  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const userId = req.user.toString();
    const comment = await this.commentsRepositories.findCommentsById(
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

@Injectable()
export class CheckOwnBlogGuard implements CanActivate {
  constructor(protected bloggersRepositories: BloggersRepositories) {}

  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const userId = req.user.toString();

    const blog = await this.bloggersRepositories.findById(
      new ObjectId(req.params.id),
    );
    if (!blog) {
      throw new NotFoundException([{ message: 'no blog', field: 'id' }]);
    }
    const blogOwnerId = blog.ownerId.toString();
    if (userId !== blogOwnerId.toString()) {
      throw new ForbiddenException([
        { message: 'not your own', field: 'user' },
      ]);
    }
    return true;
  }
}
