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
import { CommentsService } from '../application/comments.service';
import { BodyForComments } from '../comments.types';
import { IdTypeForReq, UpdateLikeDTO } from '../../posts/posts.types';
import {
  AuthGuard,
  CheckOwnGuard,
} from '../../auth/application/adapters/guards/auth.guard';
import { Request } from 'express';

@Controller('/comments')
export class CommentsController {
  constructor(protected commentsService: CommentsService) {}

  @UseGuards(AuthGuard, CheckOwnGuard)
  @Put('/:id')
  @HttpCode(204)
  async updateComment(
    @Body() body: BodyForComments,
    @Param() param: IdTypeForReq,
  ) {
    return this.commentsService.updateComment(param.id, body.content);
  }

  @UseGuards(AuthGuard, CheckOwnGuard)
  @Delete('/:id')
  @HttpCode(204)
  async deleteComment(@Param() param: IdTypeForReq) {
    return this.commentsService.deleteComment(param.id);
  }

  @UseGuards(AuthGuard)
  @Put('/:id/like-status')
  @HttpCode(204)
  async updateLike(
    @Param() param: IdTypeForReq,
    @Body() body: UpdateLikeDTO,
    @Req() req: Request,
  ) {
    const isUpdated = await this.commentsService.updateLikeStatus(
      param.id,
      body.likeStatus,
      req.user.id,
      req.user.login,
    );
    if (isUpdated === 'doesnt exists') {
      throw new NotFoundException([
        {
          message: 'comment with specified id doesnt exists',
          field: 'comment Id',
        },
      ]);
    }
    return isUpdated;
  }
}
