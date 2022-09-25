import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { BodyForComments } from '../types/comments.types';
import { IdTypeForReq } from '../types/posts.types';
import { AuthGuard, CheckOwnGuard } from '../auth.guard';
import { QueryCommentsRepositories } from './query.comments.repositories';

@Controller('/comments')
export class CommentsController {
  constructor(
    protected commentsService: CommentsService,
    protected queryCommentsRepositories: QueryCommentsRepositories,
  ) {}

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

  @Get('/:id')
  async getComment(@Param() param: IdTypeForReq) {
    const comment = await this.queryCommentsRepositories.findCommentsById(
      param.id,
    );
    if (typeof comment === 'string') {
      throw new NotFoundException([{ message: 'no comment', field: 'id' }]);
    }
    return comment;
  }
}
