import { ObjectId } from 'mongodb';
import { UserRequestType } from '../../../users/users.types';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { Response } from 'express';
import { UsersRepositories } from '../../../users/infrastructure/users.repositories';
import { BedRefreshTokensRepositories } from '../../infrastructure/bed-refresh-tokens-repositories.service';

@Injectable()
export class GuardHelper {
  constructor(
    protected usersRepositories: UsersRepositories,
    protected jwtService: JwtService,
    protected bedTokensRepositories: BedRefreshTokensRepositories,
  ) {}

  async findUserById(userId: ObjectId): Promise<UserRequestType> {
    const user = await this.usersRepositories.findUserById(userId);
    if (typeof user == 'string') {
      throw new UnauthorizedException([
        { message: 'there is no user', field: 'token' },
      ]);
    }
    return user;
  }

  public checkCookie(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException([
        { message: 'Not have refresh token in cookies', field: 'cookie' },
      ]);
    }
    return refreshToken;
  }

  async checkRefreshToken(refreshToken: string, res: Response) {
    const result = await this.bedTokensRepositories.checkToken(refreshToken);
    if (typeof result === 'string') {
      res.clearCookie('refreshToken');
      throw new UnauthorizedException([
        { message: 'invalid refreshToken', field: 'refreshToken' },
      ]);
    }
  }

  getUserRefreshToken(refreshToken: string, res: Response) {
    const user = this.jwtService.getUserIdByRefreshToken(refreshToken);
    if (typeof user === 'string') {
      res.clearCookie('refreshToken');
      throw new UnauthorizedException([
        { message: 'expired', field: 'refreshToken' },
      ]);
    }
    return user;
  }
}
