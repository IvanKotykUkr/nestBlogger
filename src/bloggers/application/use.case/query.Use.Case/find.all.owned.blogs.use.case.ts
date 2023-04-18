import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  BloggerResponseType,
  BloggerResponseTypeWithPagination,
  BloggSearchFilerType,
} from '../../../bloggers.types';
import { QueryBloggersRepositories } from '../../../infrastructure/query.bloggers.repositories';
import { ObjectId } from 'mongodb';

export class FindALLOwnedBlogsCommand {
  constructor(
    public userId: ObjectId,
    public searchNameTerm: string | null,
    public pageNumber: number,
    public pageSize: number,
    public sortBy: string,
    public sortDirection: string,
  ) {}
}

@CommandHandler(FindALLOwnedBlogsCommand)
export class FindALLOwnedBlogsUseCase
  implements ICommandHandler<FindALLOwnedBlogsCommand>
{
  constructor(protected queryBloggersRepositories: QueryBloggersRepositories) {}

  async execute(
    command: FindALLOwnedBlogsCommand,
  ): Promise<BloggerResponseTypeWithPagination> {
    const page: number = command.pageNumber;
    const pageSize: number = command.pageSize;
    const filter = this.getFilter(command.userId, command.searchNameTerm);
    const totalCountSearch: number =
      await this.queryBloggersRepositories.bloggSearchCount(filter);
    const pagesCountSearch: number = Math.ceil(totalCountSearch / pageSize);
    const itemsSearch: BloggerResponseType[] =
      await this.queryBloggersRepositories.getBloggers(
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
    ownerId: ObjectId,
    searchNameTerm: string | null,
  ): BloggSearchFilerType {
    if (searchNameTerm)
      return {
        $and: [{ ownerId }, { name: { $regex: searchNameTerm } }],
      };
    return { ownerId };
  }
}
