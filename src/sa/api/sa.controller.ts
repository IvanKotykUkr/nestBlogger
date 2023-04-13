import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Ip,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AntiDdosGuard } from '../../auth/application/adapters/guards/anti.ddos.guard';
import { CreateUserGuard } from '../../guards/create.user.guard';
import {
  BodyForCreateUser,
  QueryForGetUsers,
  UsersWithPaginationResponseType,
} from '../../users/users.types';
import { CreateUserCommand } from '../../users/application/use.case/create.user.use.case';
import { ConfirmationType, EmailBodyType } from '../../auth/auth.types';
import { ConfirmCodeUserCommand } from '../../auth/application/use.case/confirm.code.user.use.case';
import { ResendConfirmCodeUserCommand } from '../../auth/application/use.case/resend.confirm.code.user.use.case';
import { QueryUsersRepositories } from '../../users/infrastructure/query.users.repositories';

@Controller('/sa')
export class SAController {
  constructor(
    protected commandBus: CommandBus,
    protected queryBus: QueryBus,
    protected queryUsersRepositories: QueryUsersRepositories,
  ) {}

  @Get('/users')
  async getUsers(
    @Query() query: QueryForGetUsers,
  ): Promise<UsersWithPaginationResponseType> {
    const pageNumber = query.PageNumber || 1;
    const pageSize = query.PageSize || 10;
    const user = await this.queryUsersRepositories.findAllUsersWithPagination(
      pageNumber,
      pageSize,
    );
    return user;
  }

  @UseGuards(AntiDdosGuard, CreateUserGuard)
  @HttpCode(201)
  @Post('/users')
  async createUser(@Body() body: BodyForCreateUser, @Ip() ip) {
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
}
