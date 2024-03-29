import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { GuardHelper } from './guard.helper';

@Injectable()
export class RefreshTokenGuards implements CanActivate {
  constructor(protected guardHelper: GuardHelper) {}

  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();
    const refreshToken = this.guardHelper.checkCookie(req.cookies.refreshToken);
    const userMeta = this.guardHelper.getUserMetaRefreshToken(
      refreshToken,
      res,
    );
    const deviceInfo = await this.guardHelper.checkValidRefreshToken(
      userMeta.iat,
      userMeta.deviceId,
      res,
    );
    req.device = {
      userId: userMeta.userId,
      deviceId: deviceInfo.deviceId,
      date: deviceInfo.date,
    };
    return true;
  }
}

@Injectable()
export class LogoutTokenGuards implements CanActivate {
  constructor(protected guardHelper: GuardHelper) {}

  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();
    const refreshToken = this.guardHelper.checkCookie(req.cookies.refreshToken);
    const userMeta = await this.guardHelper.getUserMetaRefreshToken(
      refreshToken,
      res,
    );
    await this.guardHelper.logoutUser(userMeta.userId, userMeta.deviceId);
    return true;
  }
}
