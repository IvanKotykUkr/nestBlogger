import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthBodyType } from '../types/auth.types';
import { AuthService } from './auth.service';
import { JwtService } from '../jwt.service';
import { ObjectId } from 'mongodb';

export const wrongPassword = [
  {
    message: 'WRONG PASSWORD',
    field: 'password',
  },
];

export const wrongLogin = [
  {
    message: 'WRONG LOGIN',
    field: 'login',
  },
];

@Controller('/auth')
export class AuthController {
  constructor(
    protected authService: AuthService,
    protected jwtService: JwtService,
  ) {}

  @Post('/login')
  async login(@Body() body: AuthBodyType) {
    const userId = await this.authService.checkUser(body.login, body.password);
    if (userId === 'not found users') {
      throw new UnauthorizedException(wrongLogin);
    }
    if (userId === 'password wrong') {
      throw new UnauthorizedException(wrongPassword);
    }

    const accessToken = await this.jwtService.createAccessToken(
      userId as ObjectId,
    );
    const refreshToken = await this.jwtService.createRefreshToken(
      userId as ObjectId,
    );

    return { a: accessToken, b: refreshToken };
  }
}
