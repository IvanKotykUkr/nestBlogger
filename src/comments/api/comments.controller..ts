import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from '../application/comments.service';
import { BodyForComments } from '../comments.types';
import { IdTypeForReq } from '../../posts/posts.types';
import { AuthGuard, CheckOwnGuard } from '../../guards/auth.guard';

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
}
