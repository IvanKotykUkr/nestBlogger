import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LikesAuthGuard implements CanActivate {
  constructor(protected jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    if (!req.headers.authorization) {
      req.user = new ObjectId('63ab296b882037600d1ce455');
      return true;
    }
    const token: string = req.headers.authorization.split(' ')[1];
    try {
      const user = this.jwtService.verify(token);
      req.user = new ObjectId(user.sub);
      return true;
    } catch (error) {
      req.user = new ObjectId('63ab296b882037600d1ce455');
      return true;
    }
  }
}
