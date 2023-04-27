import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  BloggerResponseType,
  BloggerResponseTypeWithPagination,
} from '../../../bloggers.types';
import { QueryBloggersRepositories } from '../../../infrastructure/query.bloggers.repositories';

export class FindALLBlogsCommand {
  constructor(
    public searchNameTerm: string | null,
    public pageNumber: number,
    public pageSize: number,
    public sortBy: string,
    public sortDirection: string,
  ) {}
}

@CommandHandler(FindALLBlogsCommand)
export class FindALLBlogsUseCase
  implements ICommandHandler<FindALLBlogsCommand>
{
  constructor(protected queryBloggersRepositories: QueryBloggersRepositories) {}

  async execute(
    command: FindALLBlogsCommand,
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
