import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AntiDdosGuard } from '../../auth/application/adapters/guards/anti.ddos.guard';
import { CreateUserGuard } from '../../guards/create.user.guard';
import {
  BodyForCreateUser,
  UsersWithPaginationResponseType,
} from '../../users/users.types';
import { CreateUserCommand } from '../../users/application/use.case/create.user.use.case';
import { BasicAuthGuard } from '../../guards/basic.auth.guard';
import { IdTypeForReq } from '../../posts/posts.types';
import { DeleteUserCommand } from '../../users/application/use.case/delete.user.use.case';
import { notFoundUser } from '../../constants';
import { QueryForGetUsers } from '../sa.types';
import { FindAllUserCommand } from '../application/useCase/queryUseCase/find.all.user.use.case';

@Controller('/sa')
export class SAController {
  constructor(protected commandBus: CommandBus, protected queryBus: QueryBus) {}

  @UseGuards(BasicAuthGuard)
  @Put('/blogs/:id/bind-with-user/:userId')
  async bindBlog() {}

  @UseGuards(BasicAuthGuard)
  @Get('/blogs')
  async getBlogs() {}

  @UseGuards(BasicAuthGuard)
  @Put('users/:id')
  async banOrUnbanUser() {}

  @UseGuards(BasicAuthGuard)
  @Get('/users')
  async getUsers(
    @Query() query: QueryForGetUsers,
  ): Promise<UsersWithPaginationResponseType> {
    const banStatus = this.getBanStatusQuery(query.banStatus);
    const searchLoginTerm = query.searchLoginTerm;
    const searchEmailTerm = query.searchEmailTerm;
    const sortBy = query.sortBy || 'createdAt';
    const sortDirection = query.sortDirection || 'desc';
    const pageNumber = query.pageNumber || 1;
    const pageSize = query.pageSize || 10;
    return this.queryBus.execute(
      new FindAllUserCommand(
        banStatus,
        searchLoginTerm,
        searchEmailTerm,
        sortBy,
        sortDirection,
        pageNumber,
        pageSize,
      ),
    );
  }

  @UseGuards(AntiDdosGuard, BasicAuthGuard, CreateUserGuard)
  @HttpCode(201)
  @Post('/users')
  async createUser(@Body() body: BodyForCreateUser) {
    return this.commandBus.execute(
      new CreateUserCommand(body.login, body.email, body.password),
    );
  }

  @UseGuards(BasicAuthGuard)
  @Delete('/users/:id')
  @HttpCode(204)
  async deleteUsers(@Param() param: IdTypeForReq): Promise<string> {
    const isDeleted = await this.commandBus.execute(
      new DeleteUserCommand(param.id),
    );
    if (isDeleted === true) {
      return;
    }

    throw new NotFoundException(notFoundUser);
  }

  private getBanStatusQuery(banStatus: string) {
    if (banStatus != 'banned' && banStatus != 'notBanned') return 'all';
    return banStatus;
  }
}
