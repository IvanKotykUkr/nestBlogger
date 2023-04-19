import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { QueryForPaginationType } from '../bloggers.types';
import { IdTypeForReq } from '../../posts/posts.types';
import { QueryBloggersRepositories } from '../infrastructure/query.bloggers.repositories';
import { QueryPostsRepositories } from '../../posts/infrastructure/query.posts.repositories';
import { Request } from 'express';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindALLBlogsCommand } from '../application/use.case/query.Use.Case/find.all.blogs.use.case';
import { FindBloggerCommand } from '../application/use.case/find.blogger.use.case';
import { FindAllPostsCommand } from '../application/use.case/query.Use.Case/find.all.posts.use.case';

export const notFoundBlogger = [
  {
    message: 'NOT FOUND',
    field: 'blogId',
  },
];

@Controller('/blogs')
export class QueryBloggersController {
  constructor(
    protected queryBloggersRepositories: QueryBloggersRepositories,
    protected queryPostsRepositories: QueryPostsRepositories,
    protected queryBus: QueryBus,
    protected commandBus: CommandBus,
  ) {}

  @Get('/')
  async getBloggers(@Query() query: QueryForPaginationType) {
    const searchNameTerm = query.searchNameTerm || null;
    const pageNumber: number = query.pageNumber || 1;
    const pageSize: number = query.pageSize || 10;
    const sortByQuery = query.sortBy || 'createdAt';
    const sortDirectionQuery = query.sortDirection || 'desc';
    return this.queryBus.execute(
      new FindALLBlogsCommand(
        searchNameTerm,
        pageNumber,
        pageSize,
        sortByQuery,
        sortDirectionQuery,
      ),
    );
  }

  @Get('/:id/posts')
  async getPostByBlogger(
    @Param() param: IdTypeForReq,
    @Query() query: QueryForPaginationType,
    @Req() req: Request,
  ) {
    const searchNameTerm = query.searchNameTerm || null;
    const pageNumber = query.pageNumber || 1;
    const pageSize = query.pageSize || 10;
    const sortByQuery = query.sortBy || 'createdAt';
    const sortDirectionQuery = query.sortDirection || 'desc';
    const blogger = await this.commandBus.execute(
      new FindBloggerCommand(param.id),
    );

    if (blogger === 'not found') {
      throw new NotFoundException(notFoundBlogger);
    }
    return this.queryBus.execute(
      new FindAllPostsCommand(
        param.id,
        pageNumber,
        pageSize,
        sortByQuery,
        sortDirectionQuery,
      ),
    );
  }
}
