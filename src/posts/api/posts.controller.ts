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
import { BodyTypeForPost, IdTypeForReq, UpdateLikeDTO } from '../posts.types';
import { notFoundBlogger } from '../../bloggers/api/bloggers.controller';
import { BasicAuthGuard } from '../../guards/basic.auth.guard';
import { CommentsService } from '../../comments/application/comments.service';
import { BodyForComments } from '../../comments/comments.types';
import { AuthGuard } from '../../auth/application/adapters/guards/auth.guard';
import { Request } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { FindBloggerCommand } from '../../bloggers/application/use.case/find.blogger.use.case';
import { CreatePostCommand } from '../application/use.case/create.post.use.case';

export const notFoundPost = [
  {
    message: 'NOT FOUND',
    field: 'postId',
  },
];

@Controller('/posts')
export class PostsController {
  constructor(
    protected commandBus: CommandBus,
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
    const blogger = await this.commandBus.execute(
      new FindBloggerCommand(inputModel.blogId),
    );
    if (blogger === 'not found') {
      throw new NotFoundException(notFoundBlogger);
    }

    return this.commandBus.execute(
      new CreatePostCommand(
        blogger.id,
        inputModel.title,
        inputModel.shortDescription,
        inputModel.content,
        blogger.name,
      ),
    );
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

  @UseGuards(AuthGuard)
  @Put('/:id/like-status')
  @HttpCode(204)
  async updateLikeStatus(
    @Param() param: IdTypeForReq,
    @Body() inputModel: UpdateLikeDTO,
    @Req() req: Request,
  ) {
    const isUpdated = await this.postsService.updateLikeStatus(
      param.id,
      inputModel.likeStatus,
      req.user.id,
      req.user.login,
    );
    if (typeof isUpdated === 'string') {
      throw new NotFoundException(notFoundPost);
    }
    return isUpdated;
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
