import { ObjectId } from 'mongodb';
import { UserRequestType } from './types/users.types';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { QueryUsersRepositories } from './users/query.users.repositories';
import { JwtService } from './jwt.service';
import { Response } from 'express';

@Injectable()
export class GuardHelper {
  constructor(
    protected queryUsersRepositories: QueryUsersRepositories,
    protected jwtService: JwtService,
  ) {}

  async findUserById(userId: ObjectId): Promise<UserRequestType> {
    const user = await this.queryUsersRepositories.findUserById(userId);
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
