import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import mongoose, { ObjectId } from 'mongoose';
import {
  BodyTypeForPost,
  PostsResponseType,
  PostsResponseTypeWithPagination,
} from '../types/posts.types';
import { QueryForPaginationType } from '../types/bloggers,types';

@Controller('/posts')
export class PostsController {
  constructor(protected postsService: PostsService) {}

  @Get('/:id')
  async getPost(@Param('id') id: ObjectId) {
    const post: PostsResponseType | string = await this.postsService.getPost(
      id,
    );
    if (post !== 'not found') {
      return post;
    }
    throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
  }

  @Get('/')
  async getPosts(@Query() query: QueryForPaginationType) {
    const pageNumber = query.PageNumber || 1;
    const pageSize = query.PageSize || 10;
    const posts: PostsResponseTypeWithPagination =
      await this.postsService.getPosts(pageNumber, pageSize);
    return posts;
  }

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
    throw new HttpException('NOT FOUND BLOGGER', HttpStatus.NOT_FOUND);
  }

  @Put('/:id')
  @HttpCode(204)
  async updatePost(
    @Param('id') postId: mongoose.Types.ObjectId,
    @Body() inputModel: BodyTypeForPost,
  ) {
    const isUpdated = await this.postsService.updatePost(
      postId,
      inputModel.title,
      inputModel.shortDescription,
      inputModel.content,
      inputModel.bloggerId,
    );
    if (typeof isUpdated !== 'string') {
      return isUpdated;
    }
    if (isUpdated.toString() === 'not find blogger') {
      throw new HttpException('NOT FOUND BLOGGER', HttpStatus.BAD_REQUEST);
    }
    throw new HttpException('NOT FOUND POST', HttpStatus.NOT_FOUND);
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteBlogger(@Param('id') postId: mongoose.Types.ObjectId) {
    const isDeleted = await this.postsService.deletePost(postId);
    if (typeof isDeleted !== 'string') {
      return isDeleted;
    }
    throw new HttpException('NOT FOUND POST', HttpStatus.NOT_FOUND);
  }
}
