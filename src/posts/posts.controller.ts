import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import {
  BodyTypeForPost,
  IdTypeForReq,
  PostsResponseType,
  PostsResponseTypeWithPagination,
} from '../types/posts.types';
import { QueryForPaginationType } from '../types/bloggers.types';
import { QueryPostsRepositories } from './query.posts.repositories';
import { notFoundBlogger } from '../bloggers/bloggers.controller';
import { BasicAuthGuard } from '../basic.auth.guard';

export const notFoundPost = [
  {
    message: 'NOT FOUND',
    field: 'postId',
  },
];

@Controller('/posts')
export class PostsController {
  constructor(
    protected postsService: PostsService,
    protected queryPostsRepositories: QueryPostsRepositories,
  ) {}

  @Get('/:id')
  async getPost(@Param() param: IdTypeForReq) {
    const post: PostsResponseType | string =
      await this.queryPostsRepositories.findPostById(param.id);
    if (post !== 'not found') {
      return post;
    }
    throw new NotFoundException(notFoundPost);
  }

  @Get('/')
  async getPosts(@Query() query: QueryForPaginationType) {
    const pageNumber = query.PageNumber || 1;
    const pageSize = query.PageSize || 10;
    const posts: PostsResponseTypeWithPagination =
      await this.queryPostsRepositories.getAllPostsWithPagination(
        pageNumber,
        pageSize,
      );
    return posts;
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createPost(@Body() inputModel: BodyTypeForPost) {
    const newPost: PostsResponseType | string =
      await this.postsService.createPost(
        inputModel.title,
        inputModel.shortDescription,
        inputModel.content,
        inputModel.bloggerId,
      );
    if (typeof newPost !== 'string') {
      return newPost;
    }
    throw new NotFoundException(notFoundBlogger);
  }

  @UseGuards(BasicAuthGuard)
  @Put('/:id')
  @HttpCode(204)
  async updatePost(
    @Param() param: IdTypeForReq,
    @Body() inputModel: BodyTypeForPost,
  ) {
    const isUpdated = await this.postsService.updatePost(
      param.id,
      inputModel.title,
      inputModel.shortDescription,
      inputModel.content,
      inputModel.bloggerId,
    );
    if (typeof isUpdated !== 'string') {
      return isUpdated;
    }
    if (isUpdated.toString() === 'not find blogger') {
      throw new NotFoundException(notFoundBlogger);
    }
    throw new NotFoundException(notFoundPost);
  }

  @UseGuards(BasicAuthGuard)
  @Delete('/:id')
  @HttpCode(204)
  async deleteBlogger(@Param() param: IdTypeForReq) {
    const isDeleted = await this.postsService.deletePost(param.id);
    if (typeof isDeleted !== 'string') {
      return isDeleted;
    }
    throw new NotFoundException(notFoundPost);
  }
}
