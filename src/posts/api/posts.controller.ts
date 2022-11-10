import {
  Body,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from '../application/posts.service';
import {
  BodyTypeForPost,
  IdTypeForReq,
  PostsResponseType,
} from '../posts.types';
import { notFoundBlogger } from '../../bloggers/api/bloggers.controller';
import { BasicAuthGuard } from '../../guards/basic.auth.guard';
import { CommentsService } from '../../comments/application/comments.service';
import { BodyForComments } from '../../comments/comments.types';
import { AuthGuard } from '../../auth/application/adapters/auth.guard';
import { Request } from 'express';

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
    protected commentsService: CommentsService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('/:id/comments')
  async createComment(
    @Body() body: BodyForComments,
    @Param() param: IdTypeForReq,
    @Req() request: Request,
  ) {
    const comment = await this.commentsService.createComment(
      param.id,
      body.content,
      request.user.id,
      request.user.login,
    );
    if (typeof comment === 'string') {
      throw new NotFoundException(notFoundPost);
    }
    return comment;
  }

  @UseGuards(BasicAuthGuard)
  @Post('/')
  async createPost(@Body() inputModel: BodyTypeForPost) {
    const newPost: PostsResponseType | string =
      await this.postsService.createPost(
        inputModel.title,
        inputModel.shortDescription,
        inputModel.content,
        inputModel.blogId,
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
      inputModel.blogId,
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
