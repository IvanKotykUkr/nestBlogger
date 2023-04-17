import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { QueryUsersRepositories } from '../../../../users/infrastructure/query.users.repositories';
import {
  UsersResponseType,
  UsersWithPaginationResponseType,
} from '../../../../users/users.types';
import { UsersSearchCountParams } from '../../../sa.types';

export class FindAllUserCommand {
  constructor(
    public banStatus: string,
    public searchLoginTerm: string,
    public searchEmailTerm: string,
    public sortBy: string,
    public sortDirection: string,
    public pageNumber: number,
    public pageSize: number,
  ) {}
}

@CommandHandler(FindAllUserCommand)
export class FindAllUserUseCase implements ICommandHandler<FindAllUserCommand> {
  constructor(protected usersRepositories: QueryUsersRepositories) {}

  async execute(
    command: FindAllUserCommand,
  ): Promise<UsersWithPaginationResponseType> {
    const page: number = command.pageNumber;
    const pageSize: number = command.pageSize;
    const filter = this.getFilter(
      command.banStatus,
      command.searchLoginTerm,
      command.searchEmailTerm,
    );
    const totalCountSearch: number =
      await this.usersRepositories.usersSearchCount(filter);
    const pagesCountSearch: number = Math.ceil(totalCountSearch / pageSize);
    const itemsSearch: UsersResponseType[] =
      await this.usersRepositories.findAllUsers(
        filter,
        command.sortBy,
        command.sortDirection,
        pageSize,
        page,
      );

    return {
      pagesCount: pagesCountSearch,
      page,
      pageSize,
      totalCount: totalCountSearch,
      items: itemsSearch,
    };
  }

  private getFilter(
    banStatus: string,
    searchLoginTerm: string | null,
    searchEmailTerm: string | null,
  ): UsersSearchCountParams {
    if (banStatus === 'all' && !searchLoginTerm && !searchEmailTerm) return {};
    if (banStatus === 'all' && searchLoginTerm && !searchEmailTerm)
      return { 'accountData.login': { $regex: searchLoginTerm } };
    if (banStatus === 'all' && !searchLoginTerm && searchEmailTerm)
      return { 'accountData.email': { $regex: searchEmailTerm } };
    if (banStatus === 'all' && searchLoginTerm && searchEmailTerm)
      return {
        $and: [
          { 'accountData.login': { $regex: searchLoginTerm } },
          { 'accountData.email': { $regex: searchEmailTerm } },
        ],
      };
    if (banStatus === 'banned' && !searchLoginTerm && !searchEmailTerm)
      return { 'banInfo.isBanned': true };
    if (banStatus === 'banned' && searchLoginTerm && !searchEmailTerm)
      return {
        $and: [
          { 'banInfo.isBanned': true },
          { 'accountData.login': { $regex: searchLoginTerm } },
        ],
      };
    if (banStatus === 'banned' && !searchLoginTerm && searchEmailTerm)
      return {
        $and: [
          { 'banInfo.isBanned': true },
          { 'accountData.email': { $regex: searchEmailTerm } },
        ],
      };

    if (banStatus === 'banned' && searchLoginTerm && searchEmailTerm)
      return {
        $and: [
          { 'banInfo.isBanned': true },
          { 'accountData.login': { $regex: searchLoginTerm } },
          { 'accountData.email': { $regex: searchEmailTerm } },
        ],
      };

    if (banStatus === 'notBanned' && !searchLoginTerm && !searchEmailTerm)
      return { 'banInfo.isBanned': false };

    if (banStatus === 'notBanned' && searchLoginTerm && !searchEmailTerm)
      return {
        $and: [
          { 'banInfo.isBanned': true },
          { 'accountData.login': { $regex: searchLoginTerm } },
        ],
      };

    if (banStatus === 'notBanned' && !searchLoginTerm && searchEmailTerm)
      return {
        $and: [
          { 'banInfo.isBanned': false },
          { 'accountData.email': { $regex: searchEmailTerm } },
        ],
      };
    if (banStatus === 'notBanned' && searchLoginTerm && searchEmailTerm)
      return {
        $and: [
          { 'banInfo.isBanned': false },
          { 'accountData.login': { $regex: searchLoginTerm } },
          { 'accountData.email': { $regex: searchEmailTerm } },
        ],
      };

    return {};
  }
}
