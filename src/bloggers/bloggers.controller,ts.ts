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
import mongoose from 'mongoose';
import {
  BloggerType,
  BodyForCreateBloggerType,
  QueryForPaginationType,
} from '../types/bloggers,types';
import { BloggersService } from './bloggers.service';
import {
  BodyTypeForPost,
  PostsResponseTypeWithPagination,
} from '../types/posts.types';

@Controller('/bloggers')
export class BloggersController {
  constructor(protected bloggersService: BloggersService) {}

  @Get('/')
  async getBloggers(@Query() query: QueryForPaginationType) {
    const searchNameTerm = query.SearchNameTerm || null;
    const pageNumber = query.PageNumber || 1;
    const pageSize = query.PageSize || 10;

    const bloggers = await this.bloggersService.findAllBloggers(
      searchNameTerm,
      pageNumber,
      pageSize,
    );
    return bloggers;
  }

  @Get('/:id')
  async getBlogger(@Param('id') id: mongoose.Types.ObjectId) {
    const blogger = await this.bloggersService.getBlogger(id);
    if (blogger !== 'not found') {
      return blogger;
    }
    throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
  }

  @Post()
  async createBlogger(@Body() inputModel: BodyForCreateBloggerType) {
    const name = inputModel.name;
    const youtubeUrl = inputModel.youtubeUrl;
    const newBlogger: BloggerType = await this.bloggersService.createBlogger(
      name,
      youtubeUrl,
    );
    return newBlogger;
  }

  @Put('/:id')
  @HttpCode(204)
  async updateBlogger(
    @Param('id') bloggerId: mongoose.Types.ObjectId,
    @Body() inputModel: BodyForCreateBloggerType,
  ) {
    const isUpdated = await this.bloggersService.updateBlogger(
      bloggerId,
      inputModel.name,
      inputModel.youtubeUrl,
    );
    if (isUpdated) {
      return isUpdated;
    }
    throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteBlogger(@Param('id') bloggerId: mongoose.Types.ObjectId) {
    const isDeleited: boolean = await this.bloggersService.deleteBlogger(
      bloggerId,
    );
    if (isDeleited) {
      return isDeleited;
    }
    throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
  }

  @Get('/:id/posts')
  async getPostByBlogger(
    @Param('id') id: mongoose.Types.ObjectId,
    @Query() query: QueryForPaginationType,
  ) {
    const pageNumber = query.PageNumber || 1;
    const pageSize = query.PageSize || 10;

    const posts: PostsResponseTypeWithPagination | string =
      await this.bloggersService.getPostsByBloggerId(id, pageNumber, pageSize);
    if (typeof posts !== 'string') {
      return posts;
    }
    throw new HttpException('NOT FOUND BLOGGER', HttpStatus.NOT_FOUND);
  }

  @Post('/:id/posts')
  async createPostByBlogger(
    @Param('id') id: mongoose.Types.ObjectId,
    @Body() inputModel: BodyTypeForPost,
  ) {
    const newPost = await this.bloggersService.createPosts(
      id,
      inputModel.title,
      inputModel.shortDescription,
      inputModel.content,
    );
    if (typeof newPost !== 'string') {
      return newPost;
    }
    throw new HttpException('NOT FOUND BLOGGER', HttpStatus.NOT_FOUND);
  }
}
