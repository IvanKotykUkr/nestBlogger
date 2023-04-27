import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { IdTypeForReq } from '../posts.types';
import { QueryForPaginationType } from '../../bloggers/bloggers.types';
import { LikesAuthGuard } from '../../auth/application/adapters/guards/likes.auth.guard';
import { Request } from 'express';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindPostCommand } from '../application/use.case/find.post.use.case';
import { FindAllPostsCommand } from '../application/use.case/find.all.posts.use.case';
import { FindAllCommentCommand } from '../../comments/application/use.case/find.all.comment.use.case';

export const notFoundPost = [
  {
    message: 'NOT FOUND',
    field: 'postId',
  },
];

@Controller('/posts')
export class QueryPostsController {
  constructor(protected commandBus: CommandBus, protected queryBus: QueryBus) {}

  @UseGuards(LikesAuthGuard)
  @Get('/:id')
  async getPost(@Param() param: IdTypeForReq, @Req() req: Request) {
    return this.commandBus.execute(new FindPostCommand(param.id));
  }

  @UseGuards(LikesAuthGuard)
  @Get('/')
  async getPosts(@Query() query: QueryForPaginationType, @Req() req: Request) {
    const pageNumber = query.pageNumber || 1;
    const pageSize = query.pageSize || 10;
    const sortByQuery = query.sortBy || 'createdAt';
    const sortDirectionQuery = query.sortDirection || 'desc';
    return this.queryBus.execute(
      new FindAllPostsCommand(
        pageNumber,
        pageSize,
        sortByQuery,
        sortDirectionQuery,
        req.userId,
      ),
    );
  }

  @UseGuards(LikesAuthGuard)
  @Get('/:id/comments')
  async getAllCommentsForPost(
    @Param() param: IdTypeForReq,
    @Query() query: QueryForPaginationType,
    @Req() req: Request,
  ) {
    const pageNumberQuery: number = query.pageNumber || 1;
    const pageSizeQuery: number = query.pageSize || 10;
    const sortByQuery = query.sortBy || 'createdAt';
    const sortDirectionQuery = query.sortDirection || 'desc';
    const post = await this.commandBus.execute(new FindPostCommand(param.id));
    return this.queryBus.execute(
      new FindAllCommentCommand(
        post.id,
        +pageNumberQuery,
        +pageSizeQuery,
        sortByQuery,
        sortDirectionQuery,
        req.userId,
      ),
    );
  }
}
