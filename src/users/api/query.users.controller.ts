import { QueryUsersRepositories } from '../infrastructure/query.users.repositories';
import { Controller, Get, Query } from '@nestjs/common';
import {
  QueryForGetUsers,
  UsersWithPaginationResponseType,
} from '../users.types';

export const notFoundUser = [
  {
    message: 'NOT FOUND',
    field: 'userId',
  },
];

@Controller('/users')
export class QueryUsersController {
  constructor(protected queryUsersRepositories: QueryUsersRepositories) {}

  @Get('/')
  async getUsers(
    @Query() query: QueryForGetUsers,
  ): Promise<UsersWithPaginationResponseType> {
    const pageNumber = query.PageNumber || 1;
    const pageSize = query.PageSize || 10;
    const user = await this.queryUsersRepositories.findAllUsersWithPagination(
      pageNumber,
      pageSize,
    );
    console.log(user);
    return user;
  }
}
