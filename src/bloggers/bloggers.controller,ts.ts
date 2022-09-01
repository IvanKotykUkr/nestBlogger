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
import { ObjectId } from 'mongoose';
import {
  BloggerType,
  BodyForCreateBloggerType,
  QueryForGetBloggersType,
} from '../types/bloggers,types';
import { BloggersService } from './bloggers.service';

@Controller('/bloggers')
export class BloggersController {
  constructor(protected bloggersService: BloggersService) {}

  @Get('/')
  async getBloggers(@Query() query: QueryForGetBloggersType) {
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
  async getBlogger(@Param('id') id: ObjectId) {
    const blogger = await this.bloggersService.getBlogger(id);
    if (blogger !== 'not found') {
      return blogger;
    }
    throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
  }

  @Post('/')
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
    @Param('id') userId: ObjectId,
    @Body() inputModel: BodyForCreateBloggerType,
  ) {
    const isUpdated = await this.bloggersService.updateBlogger(
      userId,
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
  async deleteBlogger(@Param('id') userId: ObjectId) {
    const isDeleited: boolean = await this.bloggersService.deleteBlogger(
      userId,
    );
    if (isDeleited) {
      return isDeleited;
    }
    throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
  }

  /*
    @Get('/:id/posts')
    getPostByBlogger() {
      return;
    }
  
    @Post('/:id/posts')
    createPostByBlogger() {
      return;
    }
    
   */
}
