import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  BloggerResponseType,
  BloggerResponseTypeWithPagination,
} from '../../../bloggers.types';
import { QueryBloggersRepositories } from '../../../infrastructure/query.bloggers.repositories';
import { ObjectId } from 'mongodb';

export class FindAllPostsCommand {
  constructor(
    public blogId: ObjectId,
    public pageNumber: number,
    public pageSize: number,
    public sortBy: string,
    public sortDirection: string,
  ) {}
}

@CommandHandler(FindAllPostsCommand)
export class FindAllPostsUseCase
  implements ICommandHandler<FindAllPostsCommand>
{
  constructor(protected queryBloggersRepositories: QueryBloggersRepositories) {}

  async execute(
    command: FindAllPostsCommand,
  ): Promise<BloggerResponseTypeWithPagination> {
    const page: number = command.pageNumber;
    const pageSize: number = command.pageSize;
    const filter = this.getFilter(command.searchNameTerm);
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

  private getFilter(searchNameTerm: string | null) {
    if (searchNameTerm) return { name: { $regex: searchNameTerm } };
    return {};
  }
}
