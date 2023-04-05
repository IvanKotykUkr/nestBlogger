import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtServiceAuth } from '../jwt-service-auth.service';
import { Request } from 'express';
import { UserFromTokenType } from '../../../../users/users.types';
import { ObjectId } from 'mongodb';

@Injectable()
export class LikesAuthGuard implements CanActivate {
  constructor(protected jwtService: JwtServiceAuth) {}

  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    if (!req.headers.authorization) {
      req.userId = new ObjectId('63ab296b882037600d1ce455');
      return true;
    }
    const token: string = req.headers.authorization.split(' ')[1];
    const user: UserFromTokenType | string =
      this.jwtService.getUserIdByAccessToken(token);

    if (typeof user == 'string') {
      req.userId = new ObjectId('63ab296b882037600d1ce455');
      return true;
    }

    req.userId = user.userId;
    return true;
  }
}
