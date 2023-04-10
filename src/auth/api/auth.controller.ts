import {
  Body,
  Controller,
  Get,
  HttpCode,
  Ip,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  AuthBodyType,
  BodyForNewPasswordDTO,
  ConfirmationType,
  EmailBodyType,
  refreshType,
} from '../auth.types';
import { Request, Response } from 'express';
import {
  LogoutTokenGuards,
  RefreshTokenGuards,
} from '../application/adapters/guards/refresh.token.guards';
import { Cookies, CurrentUser, CurrentUserId } from '../../types/decorator';
import { BodyForCreateUser } from '../../users/users.types';
import { CreateUserGuard } from '../../guards/create.user.guard';
import { AntiDdosGuard } from '../application/adapters/guards/anti.ddos.guard';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../../users/application/use.case/create.user.use.case';
import { ConfirmCodeUserCommand } from '../application/use.case/confirm.code.user.use.case';
import { ResendConfirmCodeUserCommand } from '../application/use.case/resend.confirm.code.user.use.case';
import { CreateAccessTokenCommand } from '../application/use.case/create.access.token.use.case';
import { CreateRefreshTokenCommand } from '../application/use.case/create.refresh.token.use.case';
import { AddDeviceUserCommand } from '../application/use.case/addDeviceUserUseCase';
import { RecoveryPasswordUserCommand } from '../application/use.case/recovery.passsword.user.use.case';
import { NewPasswordUserCommand } from '../application/use.case/new.passsword.user.use.case';
import { LocalAuthGuard } from '../application/adapters/guards/local-auth.guard';
import { JwtAuthGuard } from '../application/adapters/guards/jwt-auth.guard';
import { MeCommand } from '../application/use.case/query.UseCase/meUseCase';
import { User } from '../../users/infrastructure/repository/users.mongoose.schema';
import { ObjectId } from 'mongodb';

@Controller('/auth')
export class AuthController {
  constructor(protected commandBus: CommandBus, protected queryBus: QueryBus) {}

  @UseGuards(AntiDdosGuard, CreateUserGuard)
  @HttpCode(204)
  @Post('/registration')
  async registration(@Body() body: BodyForCreateUser, @Ip() ip) {
    return this.commandBus.execute(
      new CreateUserCommand(body.login, body.email, body.password),
    );
  }

  @UseGuards(AntiDdosGuard)
  @Post('/registration-confirmation')
  @HttpCode(204)
  async registrationConfirmation(@Body() body: ConfirmationType) {
    return this.commandBus.execute(new ConfirmCodeUserCommand(body.code));
  }

  @UseGuards(AntiDdosGuard)
  @Post('/registration-email-resending')
  @HttpCode(204)
  async resendConfirmation(@Body() body: EmailBodyType) {
    return this.commandBus.execute(
      new ResendConfirmCodeUserCommand(body.email),
    );
  }

  @UseGuards(AntiDdosGuard, LocalAuthGuard)
  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() body: AuthBodyType,
    @Req() req: Request,
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userInfo = await this.commandBus.execute(
      new AddDeviceUserCommand(user._id, req.headers['user-agent'], req.ip),
    );

    const accessToken = await this.commandBus.execute(
      new CreateAccessTokenCommand(userInfo.userId),
    );

    const refreshToken = await this.commandBus.execute(
      new CreateRefreshTokenCommand(
        userInfo.userId,
        userInfo.deviceId,
        userInfo.date,
      ),
    );

    return this.resToken(accessToken, refreshToken, res);
  }

  @UseGuards(AntiDdosGuard, RefreshTokenGuards)
  @Post('/refresh-token')
  @HttpCode(200)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessToken = await this.commandBus.execute(
      new CreateAccessTokenCommand(req.device.userId),
    );
    const refreshToken = await this.commandBus.execute(
      new CreateRefreshTokenCommand(
        req.device.userId,
        req.device.deviceId,
        req.device.date,
      ),
    );
    return this.resToken(accessToken, refreshToken, res);
  }

  @UseGuards(AntiDdosGuard, LogoutTokenGuards)
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

  @UseGuards(AntiDdosGuard)
  @HttpCode(204)
  @Post('/password-recovery')
  async recoveryPassword(@Body() body: EmailBodyType, @Ip() ip) {
    return this.commandBus.execute(
      new RecoveryPasswordUserCommand(body.email, ip, new Date()),
    );
  }

  @UseGuards(AntiDdosGuard)
  @HttpCode(204)
  @Post('/new-password')
  async newPassword(@Body() body: BodyForNewPasswordDTO, @Ip() ip) {
    return this.commandBus.execute(
      new NewPasswordUserCommand(body.newPassword, body.recoveryCode, ip),
    );
  }

  @UseGuards(AntiDdosGuard, JwtAuthGuard)
  @Get('/me')
  async getUserFromAccessesToken(
    @CurrentUserId() userId: ObjectId,
    @Req() req: Request,
  ) {
    return await this.queryBus.execute(new MeCommand(userId));
  }

  protected resToken(
    accessToken: { accessToken: string },
    refreshToken: string,
    res: Response,
  ) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return accessToken;
  }
}
