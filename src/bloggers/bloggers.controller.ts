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
import mongoose from 'mongoose';
import {
  BloggerResponseType,
  BloggerType,
  BodyForCreateBloggerType,
  QueryForPaginationType,
} from '../types/bloggers.types';
import { BloggersService } from './bloggers.service';
import { BodyTypeForPostBlogger, IdTypeForReq } from '../types/posts.types';
import { QueryBloggersRepositories } from './query.bloggers.repositories';
import { QueryPostsRepositories } from '../posts/query.posts.repositories';
import { BasicAuthGuard } from '../basic.auth.guard';

export const notFoundBlogger = [
  {
    message: 'NOT FOUND',
    field: 'bloggerId',
  },
];

@Controller('/bloggers')
export class BloggersController {
  constructor(
    protected bloggersService: BloggersService,
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

  @UseGuards(BasicAuthGuard)
  @Post()
  @HttpCode(201)
  async createBlogger(@Body() inputModel: BodyForCreateBloggerType) {
    const name = inputModel.name;
    const youtubeUrl = inputModel.youtubeUrl;
    const newBlogger: BloggerType = await this.bloggersService.createBlogger(
      name,
      youtubeUrl,
    );
    return newBlogger;
  }

  @UseGuards(BasicAuthGuard)
  @Put('/:id')
  @HttpCode(204)
  async updateBlogger(
    @Param() param: IdTypeForReq,
    @Body() inputModel: BodyForCreateBloggerType,
  ) {
    const isUpdated = await this.bloggersService.updateBlogger(
      param.id,
      inputModel.name,
      inputModel.youtubeUrl,
    );
    if (isUpdated) {
      return isUpdated;
    }
    throw new NotFoundException(notFoundBlogger);
  }

  @UseGuards(BasicAuthGuard)
  @Delete('/:id')
  @HttpCode(204)
  async deleteBlogger(@Param() bloggerId: mongoose.Types.ObjectId) {
    const isDeleited: boolean = await this.bloggersService.deleteBlogger(
      bloggerId,
    );
    if (isDeleited) {
      return isDeleited;
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

  @UseGuards(BasicAuthGuard)
  @Post('/:id/posts')
  async createPostByBlogger(
    @Param() param: IdTypeForReq,
    @Body() inputModel: BodyTypeForPostBlogger,
  ) {
    const blogger = await this.queryBloggersRepositories.findBloggerById(
      param.id,
    );
    if (blogger === 'not found') {
      throw new NotFoundException(notFoundBlogger);
    }

    return this.bloggersService.createPosts(
      param.id,
      inputModel.title,
      inputModel.shortDescription,
      inputModel.content,
    );
  }
}
