import {
  Body,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BloggerType, BodyForCreateBloggerType } from '../bloggers.types';
import { BloggersService } from '../application/bloggers.service';
import { BodyTypeForPostBlogger, IdTypeForReq } from '../../posts/posts.types';
import { BasicAuthGuard } from '../../guards/basic.auth.guard';

export const notFoundBlogger = [
  {
    message: 'NOT FOUND',
    field: 'blogId',
  },
];

@Controller('/blogs')
export class BloggersController {
  constructor(protected bloggersService: BloggersService) {}

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
  async deleteBlogger(@Param() param: IdTypeForReq) {
    const isDeleited: boolean = await this.bloggersService.deleteBlogger(
      param.id,
    );
    if (isDeleited) {
      return isDeleited;
    }
    throw new NotFoundException(notFoundBlogger);
  }

  @UseGuards(BasicAuthGuard)
  @Post('/:id/posts')
  async createPostByBlogger(
    @Param() param: IdTypeForReq,
    @Body() inputModel: BodyTypeForPostBlogger,
  ) {
    const blogger = await this.bloggersService.findBloggerById(param.id);
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
