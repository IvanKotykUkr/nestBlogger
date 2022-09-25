import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthBodyType } from '../types/auth.types';
import { AuthService } from './auth.service';
import { JwtService } from '../jwt.service';
import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';

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
  async login(
    @Body() body: AuthBodyType,
    @Res({ passthrough: true }) res: Response,
  ) {
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

    return this.resToken(accessToken, refreshToken, res);
  }

  @Post('/refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessToken = await this.jwtService.createAccessToken(req.user.id);
    const refreshToken = await this.jwtService.createRefreshToken(req.user.id);

    return this.resToken(accessToken, refreshToken, res);
  }

  protected resToken(
    accessToken: { accessToken: string },
    refreshToken: string,
    res: Response,
  ) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      // secure: true,
    });
    return accessToken;
  }
}
