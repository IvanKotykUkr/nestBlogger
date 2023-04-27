import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { IdTypeForReq } from '../../posts/posts.types';
import { LikesAuthGuard } from '../../auth/application/adapters/guards/likes.auth.guard';
import { Request } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { FindCommentCommand } from '../application/use.case/find.comment.use.case';

@Controller('/comments')
export class QueryCommentsController {
  constructor(protected commandBus: CommandBus) {}

  @UseGuards(LikesAuthGuard)
  @Get('/:id')
  async getComment(@Param() param: IdTypeForReq, @Req() req: Request) {
    return this.commandBus.execute(new FindCommentCommand(param.id));
  }
}
