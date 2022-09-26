import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthBodyType, refreshType } from '../types/auth.types';
import { AuthService } from './auth.service';
import { JwtService } from '../jwt.service';
import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { LogoutTokenGuards, RefreshTokenGuards } from '../refresh.token.guards';
import { AuthGuard } from '../auth.guard';
import { Cookies } from '../types/decorator';
import { BodyForCreateUser } from '../types/users.types';
import { CreateUserGuard } from '../create.user.guard';

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

  @UseGuards(CreateUserGuard)
  @Post('/registration')
  async registration(@Body() body: BodyForCreateUser) {
    const user = await this.authService.createUser(
      body.login,
      body.email,
      body.password,
    );
    return user;
  }

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

  @UseGuards(RefreshTokenGuards)
  @Post('/refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessToken = await this.jwtService.createAccessToken(req.user.id);
    const refreshToken = await this.jwtService.createRefreshToken(req.user.id);

    return this.resToken(accessToken, refreshToken, res);
  }

  @UseGuards(LogoutTokenGuards)
  @HttpCode(204)
  @Post('/logout')
  async logout(
    @Cookies('refreshToken') token: refreshType,
    @Res() res: Response,
  ) {
    res.clearCookie('refreshToken');
    res.send();
    return;
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  async getUserFromAccessesToken(@Req() req: Request) {
    return {
      email: req.user.email,
      login: req.user.login,
      userId: req.user.id,
    };
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
