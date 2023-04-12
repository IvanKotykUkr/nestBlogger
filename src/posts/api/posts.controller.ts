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
import { BodyTypeForPost, IdTypeForReq, UpdateLikeDTO } from '../posts.types';
import { BasicAuthGuard } from '../../guards/basic.auth.guard';
import { BodyForComments } from '../../comments/comments.types';
import { CommandBus } from '@nestjs/cqrs';
import { FindBloggerCommand } from '../../bloggers/application/use.case/find.blogger.use.case';
import { CreatePostCommand } from '../application/use.case/create.post.use.case';
import { UpdatePostCommand } from '../application/use.case/update.post.use.case';
import { DeletePostCommand } from '../application/use.case/delete.post.use.case';
import { FindPostCommand } from '../application/use.case/find.post.use.case';
import { CreateCommentCommand } from '../../comments/application/use.case/create.comment.use.case';
import { UpdateLikeCommand } from '../../comments/application/use.case/update.like.use.case';
import { CurrentUser, CurrentUserId } from '../../types/decorator';
import { UserRequestType } from '../../users/users.types';
import { ObjectId } from 'mongodb';
import { FindUserByIdCommand } from '../../users/application/use.case/find.user.use.case';
import { JwtAuthGuard } from '../../auth/application/adapters/guards/jwt-auth.guard';
import { notFoundBlogger } from '../../constants';

@Controller('/posts')
export class PostsController {
  constructor(protected commandBus: CommandBus) {}

  @UseGuards(JwtAuthGuard)
  @Post('/:id/comments')
  async createComment(
    @Body() body: BodyForComments,
    @Param() param: IdTypeForReq,
    @CurrentUserId() userId: ObjectId,
  ) {
    const post = await this.commandBus.execute(new FindPostCommand(param.id));

    const user = await this.commandBus.execute(new FindUserByIdCommand(userId));
    return this.commandBus.execute(
      new CreateCommentCommand(post.id, body.content, user.id, user.login),
    );
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
    const blogger = await this.commandBus.execute(
      new FindBloggerCommand(inputModel.blogId),
    );
    if (blogger === 'not found') {
      throw new NotFoundException(notFoundBlogger);
    }
    const isUpdated = await this.commandBus.execute(
      new UpdatePostCommand(
        param.id,
        inputModel.title,
        inputModel.shortDescription,
        inputModel.content,
        inputModel.blogId,
        blogger.name,
      ),
    );
    return isUpdated;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id/like-status')
  @HttpCode(204)
  async updateLikeStatus(
    @Param() param: IdTypeForReq,
    @Body() inputModel: UpdateLikeDTO,
    @CurrentUser() user: UserRequestType,
  ) {
    const post = await this.commandBus.execute(new FindPostCommand(param.id));
    return this.commandBus.execute(
      new UpdateLikeCommand(
        post.id,
        inputModel.likeStatus,
        user.id,
        user.login,
      ),
    );
  }

  @UseGuards(BasicAuthGuard)
  @Delete('/:id')
  @HttpCode(204)
  async deleteBlogger(@Param() param: IdTypeForReq) {
    return this.commandBus.execute(new DeletePostCommand(param.id));
  }
}
