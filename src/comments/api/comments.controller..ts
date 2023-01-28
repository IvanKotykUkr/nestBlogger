import {
  Body,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BodyForComments } from '../comments.types';
import { IdTypeForReq, UpdateLikeDTO } from '../../posts/posts.types';
import {
  AuthGuard,
  CheckOwnGuard,
} from '../../auth/application/adapters/guards/auth.guard';
import { Request } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateCommentCommand } from '../application/use.case/update.comment.use.case';
import { DeleteCommentCommand } from '../application/use.case/delete.comment.use.case';
import { FindCommentCommand } from '../application/use.case/find.comment.use.case';
import { UpdateLikeCommand } from '../application/use.case/update.like.use.case';

@Controller('/comments')
export class CommentsController {
  constructor(protected commandBus: CommandBus) {}

  @UseGuards(AuthGuard, CheckOwnGuard)
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

  @UseGuards(AuthGuard, CheckOwnGuard)
  @Delete('/:id')
  @HttpCode(204)
  async deleteComment(@Param() param: IdTypeForReq) {
    return this.commandBus.execute(new DeleteCommentCommand(param.id));
  }

  @UseGuards(AuthGuard)
  @Put('/:id/like-status')
  @HttpCode(204)
  async updateLike(
    @Param() param: IdTypeForReq,
    @Body() body: UpdateLikeDTO,
    @Req() req: Request,
  ) {
    const comment = await this.commandBus.execute(
      new FindCommentCommand(param.id),
    );
    if (typeof comment === 'string') {
      throw new NotFoundException([
        {
          message: 'comment with specified id doesnt exists',
          field: 'comment Id',
        },
      ]);
    }

    return this.commandBus.execute(
      new UpdateLikeCommand(
        param.id,
        body.likeStatus,
        req.user.id,
        req.user.login,
      ),
    );
  }
}
