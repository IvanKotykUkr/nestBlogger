import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { IdTypeForReq, UpdateLikeDTO } from '../posts.types';
import { BodyForComments } from '../../comments/comments.types';
import { CommandBus } from '@nestjs/cqrs';
import { FindPostCommand } from '../application/use.case/find.post.use.case';
import { CreateCommentCommand } from '../../comments/application/use.case/create.comment.use.case';
import { UpdateLikeCommand } from '../../comments/application/use.case/update.like.use.case';
import { CurrentUser, CurrentUserId } from '../../types/decorator';
import { UserRequestType } from '../../users/users.types';
import { ObjectId } from 'mongodb';
import { FindUserByIdCommand } from '../../users/application/use.case/find.user.use.case';
import { JwtAuthGuard } from '../../auth/application/adapters/guards/jwt-auth.guard';

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
}
