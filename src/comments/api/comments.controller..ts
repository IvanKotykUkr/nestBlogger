import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BodyForComments } from '../comments.types';
import { IdTypeForReq, UpdateLikeDTO } from '../../posts/posts.types';
import { CheckOwnGuard } from '../../auth/application/adapters/guards/autherisation-guard.service';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateCommentCommand } from '../application/use.case/update.comment.use.case';
import { DeleteCommentCommand } from '../application/use.case/delete.comment.use.case';
import { FindCommentCommand } from '../application/use.case/find.comment.use.case';
import { UpdateLikeCommand } from '../application/use.case/update.like.use.case';
import { JwtAuthGuard } from '../../auth/application/adapters/guards/jwt-auth.guard';
import { ObjectId } from 'mongodb';
import { CurrentUserId } from '../../types/decorator';
import { FindUserByIdCommand } from '../../users/application/use.case/find.user.use.case';

@Controller('/comments')
export class CommentsController {
  constructor(protected commandBus: CommandBus) {}

  @UseGuards(JwtAuthGuard, CheckOwnGuard)
  @Put('/:id')
  @HttpCode(204)
  async updateComment(
    @Body() body: BodyForComments,
    @Param() param: IdTypeForReq,
  ) {
    return this.commandBus.execute(
      new UpdateCommentCommand(param.id, body.content),
    );
  }

  @UseGuards(JwtAuthGuard, CheckOwnGuard)
  @Delete('/:id')
  @HttpCode(204)
  async deleteComment(@Param() param: IdTypeForReq) {
    return this.commandBus.execute(new DeleteCommentCommand(param.id));
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id/like-status')
  @HttpCode(204)
  async updateLike(
    @Param() param: IdTypeForReq,
    @Body() body: UpdateLikeDTO,
    @CurrentUserId() userId: ObjectId,
  ) {
    const comment = await this.commandBus.execute(
      new FindCommentCommand(param.id),
    );
    const user = await this.commandBus.execute(new FindUserByIdCommand(userId));
    return this.commandBus.execute(
      new UpdateLikeCommand(comment.id, body.likeStatus, user.id, user.login),
    );
  }
}
