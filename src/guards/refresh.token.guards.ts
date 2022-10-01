import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '../jwt.service';
import { UserFromTokenType } from '../users/users.types';
import { GuardHelper } from './guard.helper';

@Injectable()
export class RefreshTokenGuards implements CanActivate {
  constructor(
    protected jwtService: JwtService,
    protected guardHelper: GuardHelper,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();
    const refreshToken = this.guardHelper.checkCookie(req.cookies.refreshToken);
    const user: UserFromTokenType = this.guardHelper.getUserRefreshToken(
      refreshToken,
      res,
    );

    req.user = await this.guardHelper.findUserById(user.userId);
    return true;
  }
}

@Injectable()
export class LogoutTokenGuards implements CanActivate {
  constructor(
    protected jwtService: JwtService,
    protected guardHelper: GuardHelper,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();
    const refreshToken = this.guardHelper.checkCookie(req.cookies.refreshToken);
    const user: UserFromTokenType = this.guardHelper.getUserRefreshToken(
      refreshToken,
      res,
    );
    return true;
  }
}
