import { BloggerResponseType } from '../../bloggers.types';
import { ObjectId } from 'mongodb';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { notFoundBlogger } from '../../../constants';
import { QueryBloggersRepositories } from '../../infrastructure/query.bloggers.repositories';

export class FindBloggerCommand {
  constructor(public id: ObjectId) {}
}

@QueryHandler(FindBloggerCommand)
export class FindBloggerUseCase implements IQueryHandler<FindBloggerCommand> {
  constructor(protected queryBloggersRepositories: QueryBloggersRepositories) {}

  async execute(
    command: FindBloggerCommand,
  ): Promise<BloggerResponseType | string> {
    const blogger = await this.queryBloggersRepositories.findBloggerById(
      command.id,
    );
    if (blogger === 'not found') {
      throw new NotFoundException(notFoundBlogger);
    }
    return blogger;
  }
}
