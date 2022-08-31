import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ObjectId } from 'mongoose';
import {
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

    return pageNumber;
  }

  @Get('/:id')
  async getBlogger(@Param('id') id: ObjectId) {
    const blogger = await this.bloggersService.getBlogger(id);
    return blogger;
  }

  @Post('/')
  async createBlogger(@Body() inputModel: BodyForCreateBloggerType) {
    const name = inputModel.name;
    const youtubeUrl = inputModel.youtubeUrl;
  }

  @Put('/:id')
  async updateBlogger(
    @Param('id') userId: string,
    @Body() inputModel: BodyForCreateBloggerType,
  ) {
    return;
  }

  @Delete('/:id')
  async deleteBlogger(@Param('id') userId: string) {
    return;
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
