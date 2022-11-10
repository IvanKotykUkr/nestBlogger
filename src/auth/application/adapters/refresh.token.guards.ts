import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserFromTokenType } from '../../../users/users.types';
import { GuardHelper } from './guard.helper';
import { BedRefreshTokensRepositories } from '../../infrastructure/bed-refresh-tokens-repositories.service';

@Injectable()
export class RefreshTokenGuards implements CanActivate {
  constructor(
    protected guardHelper: GuardHelper,
    protected bedTokensRepositories: BedRefreshTokensRepositories,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();
    const refreshToken = this.guardHelper.checkCookie(req.cookies.refreshToken);
    await this.guardHelper.checkRefreshToken(refreshToken, res);
    const user: UserFromTokenType = this.guardHelper.getUserRefreshToken(
      refreshToken,
      res,
    );
    await this.bedTokensRepositories.saveBedToken(refreshToken);
    req.user = await this.guardHelper.findUserById(user.userId);
    return true;
  }
}

@Injectable()
export class LogoutTokenGuards implements CanActivate {
  constructor(
    protected guardHelper: GuardHelper,
    protected bedTokensRepositories: BedRefreshTokensRepositories,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();
    const refreshToken = this.guardHelper.checkCookie(req.cookies.refreshToken);
    await this.guardHelper.checkRefreshToken(refreshToken, res);
    const user: UserFromTokenType = this.guardHelper.getUserRefreshToken(
      refreshToken,
      res,
    );
    await this.bedTokensRepositories.saveBedToken(refreshToken);
    return true;
  }
}
