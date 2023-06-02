import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { QueryBloggersRepositories } from '../../../../bloggers/infrastructure/query.bloggers.repositories';
import {
  BloggerResponseSaType,
  BloggerResponseSaTypeWithPagination,
} from '../../../sa.types';

export class FindALLBlogsSaCommand {
  constructor(
    public searchNameTerm: string | null,
    public pageNumber: number,
    public pageSize: number,
    public sortBy: string,
    public sortDirection: string,
  ) {}
}

@QueryHandler(FindALLBlogsSaCommand)
export class FindALLBlogsSaUseCase
  implements IQueryHandler<FindALLBlogsSaCommand>
{
  constructor(protected queryBloggersRepositories: QueryBloggersRepositories) {}

  async execute(
    command: FindALLBlogsSaCommand,
  ): Promise<BloggerResponseSaTypeWithPagination> {
    const page: number = command.pageNumber;
    const pageSize: number = command.pageSize;
    const filter = this.getFilter(command.searchNameTerm);
    const totalCountSearch: number =
      await this.queryBloggersRepositories.blogsSearchCount(filter);
    const pagesCountSearch: number = Math.ceil(totalCountSearch / pageSize);
    const itemsSearch: BloggerResponseSaType[] =
      await this.queryBloggersRepositories.getBloggersSa(
        filter,
        command.sortBy,
        command.sortDirection,
        pageSize,
        page,
      );

    return {
      pagesCount: +pagesCountSearch,
      page: +page,
      pageSize: +pageSize,
      totalCount: +totalCountSearch,
      items: itemsSearch,
    };
  }

  private getFilter(searchNameTerm: string | null) {
    if (searchNameTerm)
      return { name: { $regex: new RegExp(searchNameTerm, 'i') } };
    return {};
  }
}
