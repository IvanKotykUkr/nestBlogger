import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  IdTypeForReq,
  PostsResponseType,
  PostsResponseTypeWithPagination,
} from '../posts.types';
import { QueryForPaginationType } from '../../bloggers/bloggers.types';
import { QueryPostsRepositories } from '../infrastructure/query.posts.repositories';
import { QueryCommentsRepositories } from '../../comments/infrastructure/query.comments.repositories';
import { ObjectId } from 'mongodb';
import { LikesAuthGuard } from '../../auth/application/adapters/guards/likes.auth.guard';
import { Request } from 'express';

export const notFoundPost = [
  {
    message: 'NOT FOUND',
    field: 'postId',
  },
];

@Controller('/posts')
export class QueryPostsController {
  constructor(
    protected queryPostsRepositories: QueryPostsRepositories,
    protected queryCommentsRepositories: QueryCommentsRepositories,
  ) {}

  @UseGuards(LikesAuthGuard)
  @Get('/:id')
  async getPost(@Param() param: IdTypeForReq) {
    const post: PostsResponseType | string =
      await this.queryPostsRepositories.findPostById(param.id);
    if (post === 'not found') {
      throw new NotFoundException(notFoundPost);
    }
    return post;
  }

  @UseGuards(LikesAuthGuard)
  @Get('/')
  async getPosts(@Query() query: QueryForPaginationType, @Req() req: Request) {
    const pageNumber = query.pageNumber || 1;
    const pageSize = query.pageSize || 10;
    const posts: PostsResponseTypeWithPagination =
      await this.queryPostsRepositories.getAllPostsWithPagination(
        pageNumber,
        pageSize,
        req.userId,
      );
    return posts;
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
    const post = await this.queryPostsRepositories.findPostById(
      new ObjectId(param.id),
    );
    if (typeof post == 'string') {
      throw new NotFoundException(notFoundPost);
    }
    return this.queryCommentsRepositories.findAllComments(
      param.id,
      +pageNumberQuery,
      +pageSizeQuery,
      sortByQuery,
      sortDirectionQuery,
      req.userId,
    );
  }
}
