import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { BloggerResponseType, QueryForPaginationType } from '../bloggers.types';
import { IdTypeForReq } from '../../posts/posts.types';
import { QueryBloggersRepositories } from '../infrastructure/query.bloggers.repositories';
import { QueryPostsRepositories } from '../../posts/infrastructure/query.posts.repositories';

export const notFoundBlogger = [
  {
    message: 'NOT FOUND',
    field: 'bloggerId',
  },
];

@Controller('/bloggers')
export class QueryBloggersController {
  constructor(
    protected queryBloggersRepositories: QueryBloggersRepositories,
    protected queryPostsRepositories: QueryPostsRepositories,
  ) {}

  @Get('/')
  async getBloggers(@Query() query: QueryForPaginationType) {
    const searchNameTerm = query.SearchNameTerm || null;
    const pageNumber = query.PageNumber || 1;
    const pageSize = query.PageSize || 10;

    const bloggers = await this.queryBloggersRepositories.findAllBloggers(
      searchNameTerm,
      pageNumber,
      pageSize,
    );
    return bloggers;
  }

  @Get('/:id')
  async getBlogger(@Param() param: IdTypeForReq) {
    const blogger: BloggerResponseType | string =
      await this.queryBloggersRepositories.findBloggerById(param.id);
    if (blogger !== 'not found') {
      return blogger;
    }
    throw new NotFoundException(notFoundBlogger);
  }

  @Get('/:id/posts')
  async getPostByBlogger(
    @Param() param: IdTypeForReq,
    @Query() query: QueryForPaginationType,
  ) {
    const pageNumber = query.PageNumber || 1;
    const pageSize = query.PageSize || 10;
    const blogger = await this.queryBloggersRepositories.findBloggerById(
      param.id,
    );
    if (blogger === 'not found') {
      throw new NotFoundException(notFoundBlogger);
    }
    return this.queryPostsRepositories.getAllPostsWithPagination(
      pageNumber,
      pageSize,
      param.id,
    );
  }
}
