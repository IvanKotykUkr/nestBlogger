import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { GuardHelper } from './guard.helper';

@Injectable()
export class RefreshTokenGuards implements CanActivate {
  constructor(protected guardHelper: GuardHelper) {}

  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();
    console.log(req.cookies);
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
    const user = await this.guardHelper.findUserById(userMeta.userId);
    req.user = {
      id: user.id,
      passwordHash: user.passwordHash,
      passwordSalt: user.passwordSalt,
      login: user.login,
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
