import { BloggersRepositories } from '../../infrastructure/bloggers.repositories';
import { BloggerResponseType } from '../../bloggers.types';
import { ObjectId } from 'mongodb';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { notFoundBlogger } from '../../../constants';

export class FindBloggerCommand {
  constructor(public id: ObjectId) {}
}

@CommandHandler(FindBloggerCommand)
export class FindBloggerUseCase implements ICommandHandler<FindBloggerCommand> {
  constructor(protected bloggersRepositories: BloggersRepositories) {}

  async execute(
    command: FindBloggerCommand,
  ): Promise<BloggerResponseType | string> {
    const blogger = await this.bloggersRepositories.findBlogger(command.id);
    if (blogger === 'not found') {
      throw new NotFoundException(notFoundBlogger);
    }
    return blogger;
  }
}
