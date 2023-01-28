import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GuardHelper } from '../../../../auth/application/adapters/guards/guard.helper';
import { Request, Response } from 'express';

@Injectable()
export class DeviceGuards implements CanActivate {
  constructor(protected guardHelper: GuardHelper) {}

  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();
    const refreshToken = this.guardHelper.checkCookie(req.cookies.refreshToken);
    const userMeta = this.guardHelper.getUserMetaRefreshToken(
      refreshToken,
      res,
    );
    req.device = {
      userId: userMeta.userId,
      deviceId: userMeta.deviceId,
      date: userMeta.date,
    };
    return true;
  }
}
