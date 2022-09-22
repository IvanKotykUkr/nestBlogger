import { UsersService } from './users.service';
import { QueryUsersRepositories } from './query.users.repositories';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  BodyForCreateUser,
  QueryForGetUsers,
  UsersResponseType,
  UsersWithPaginationResponseType,
} from '../types/users.types';
import { IdTypeForReq } from '../types/posts.types';

export const notFoundUser = [
  {
    message: 'NOT FOUND',
    field: 'userId',
  },
];

@Controller('/users')
export class UsersController {
  constructor(
    protected usersService: UsersService,
    protected queryUsersRepositories: QueryUsersRepositories,
  ) {}

  @Get('/')
  async getUsers(
    @Query() query: QueryForGetUsers,
  ): Promise<UsersWithPaginationResponseType> {
    const pageNumber = query.PageNumber || 1;
    const pageSize = query.PageSize || 10;
    return this.queryUsersRepositories.findAllUsersWithPagination(
      pageNumber,
      pageSize,
    );
  }

  @Post('/')
  @HttpCode(201)
  async createUsers(
    @Body() inputModel: BodyForCreateUser,
  ): Promise<UsersResponseType> {
    return this.usersService.createUsers(
      inputModel.login,
      inputModel.email,
      inputModel.password,
    );
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteUsers(@Param() param: IdTypeForReq): Promise<string> {
    const isDeleted = await this.usersService.deleteUsers(param.id);
    if (isDeleted === true) {
      return;
    }

    throw new NotFoundException(notFoundUser);
  }
}
