import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { IdTypeForReq } from '../../posts/posts.types';
import { LikesAuthGuard } from '../../auth/application/adapters/guards/likes.auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { FindCommentWithLikeCommand } from '../application/use.case/find.comment.with.likes.info.use.case';
import { CurrentUserId } from '../../types/decorator';
import { ObjectId } from 'mongodb';

@Controller('/comments')
export class QueryCommentsController {
  constructor(protected commandBus: CommandBus) {}

  @UseGuards(LikesAuthGuard)
  @Get('/:id')
  async getComment(
    @Param() param: IdTypeForReq,
    @CurrentUserId() userId: ObjectId,
  ) {
    return this.commandBus.execute(
      new FindCommentWithLikeCommand(param.id, userId),
    );
  }
}
