import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { IdTypeForReq } from '../../posts/posts.types';
import { QueryCommentsRepositories } from '../infrastructure/query.comments.repositories';

@Controller('/comments')
export class QueryCommentsController {
  constructor(protected queryCommentsRepositories: QueryCommentsRepositories) {}

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
