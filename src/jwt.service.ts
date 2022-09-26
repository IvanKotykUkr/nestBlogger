import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { UserFromTokenType } from './types/users.types';
import { ObjectId } from 'mongodb';

export const wrong = 'wrong';

@Injectable()
export class JwtService {
  async createAccessToken(id: ObjectId): Promise<{ accessToken: string }> {
    const access: string = jwt.sign(
      { userId: id },
      process.env.ACCESS_JWT_SECRET,
      { expiresIn: '1H' },
    );

    return { accessToken: access };
  }

  async createRefreshToken(id: ObjectId): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const refresh: string = jwt.sign(
      { userId: id },
      process.env.REFRESH_JWT_SECRET,
      { expiresIn: '2H' },
    );

    return refresh;
  }

  getUserIdByAccessToken(token: string): UserFromTokenType | string {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return jwt.verify(token, process.env.ACCESS_JWT_SECRET);
    } catch (error) {
      return wrong;
    }
  }

  getUserIdByRefreshToken(token: string): UserFromTokenType | string {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return jwt.verify(token, process.env.REFRESH_JWT_SECRET);
    } catch (error) {
      return wrong;
    }
  }
}
