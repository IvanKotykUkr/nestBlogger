import {
  Body,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BodyForComments } from '../comments.types';
import { IdTypeForReq, UpdateLikeDTO } from '../../posts/posts.types';
import {
  AuthorizationGuard,
  CheckOwnGuard,
} from '../../auth/application/adapters/guards/autherisation-guard.service';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateCommentCommand } from '../application/use.case/update.comment.use.case';
import { DeleteCommentCommand } from '../application/use.case/delete.comment.use.case';
import { FindCommentCommand } from '../application/use.case/find.comment.use.case';
import { UpdateLikeCommand } from '../application/use.case/update.like.use.case';
import { CurrentUser } from '../../types/decorator';
import { UserRequestType } from '../../users/users.types';

@Controller('/comments')
export class CommentsController {
  constructor(protected commandBus: CommandBus) {}

  @UseGuards(AuthorizationGuard, CheckOwnGuard)
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

  @UseGuards(AuthorizationGuard, CheckOwnGuard)
  @Delete('/:id')
  @HttpCode(204)
  async deleteComment(@Param() param: IdTypeForReq) {
    return this.commandBus.execute(new DeleteCommentCommand(param.id));
  }

  @UseGuards(AuthorizationGuard)
  @Put('/:id/like-status')
  @HttpCode(204)
  async updateLike(
    @Param() param: IdTypeForReq,
    @Body() body: UpdateLikeDTO,
    @CurrentUser() user: UserRequestType,
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
      new UpdateLikeCommand(param.id, body.likeStatus, user.id, user.login),
    );
  }
}
