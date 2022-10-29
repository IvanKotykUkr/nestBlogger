import {
  BadRequestException,
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
import {
  AuthBodyType,
  ConfirmationType,
  refreshType,
  ResendConfirmationType,
} from '../auth.types';
import { AuthService } from '../application/auth.service';
import { JwtService } from '../../jwt.service';
import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import {
  LogoutTokenGuards,
  RefreshTokenGuards,
} from '../../guards/refresh.token.guards';
import { AuthGuard } from '../../guards/auth.guard';
import { Cookies } from '../../types/decorator';
import { BodyForCreateUser } from '../../users/users.types';
import { CreateUserGuard } from '../../guards/create.user.guard';

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
  @HttpCode(204)
  @Post('/registration')
  async registration(@Body() body: BodyForCreateUser) {
    const user = await this.authService.createUser(
      body.login,
      body.email,
      body.password,
    );
    return;
  }

  @Post('/registration-confirmation')
  @HttpCode(204)
  async registrationConfirmation(@Body() body: ConfirmationType) {
    const isConfirmed = await this.authService.confirmUser(body.code);
    if (isConfirmed === 'not found') {
      throw new BadRequestException([
        { message: ' code doesnt exist', field: 'code' },
      ]);
    }
    if (isConfirmed === 'already confirmed') {
      throw new BadRequestException([
        { message: 'code already confirmed', field: 'code' },
      ]);
    }
    if (isConfirmed === 'code expired') {
      throw new BadRequestException([
        { message: 'code expired', field: 'code' },
      ]);
    }
    return true;
  }

  @Post('/registration-email-resending')
  @HttpCode(204)
  async resendConfirmation(@Body() body: ResendConfirmationType) {
    const dispatchCode = await this.authService.resendConfirmationCode(
      body.email,
    );
    if (dispatchCode === 'not found users') {
      throw new BadRequestException([
        { message: 'user email doesnt exist', field: 'email' },
      ]);
    }
    if (dispatchCode === 'already confirmed') {
      throw new BadRequestException([
        { message: 'email already confirmed', field: 'email' },
      ]);
    }

    return dispatchCode;
  }

  @Post('/login')
  @HttpCode(200)
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
  @HttpCode(200)
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
