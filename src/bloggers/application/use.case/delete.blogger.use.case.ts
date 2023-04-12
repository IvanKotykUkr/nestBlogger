import { BloggersRepositories } from '../../infrastructure/bloggers.repositories';
import { ObjectId } from 'mongodb';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { notFoundBlogger } from '../../../constants';

export class DeleteBloggerCommand {
  constructor(public id: ObjectId) {}
}

@CommandHandler(DeleteBloggerCommand)
export class DeleteBloggerUseCase
  implements ICommandHandler<DeleteBloggerCommand>
{
  constructor(protected bloggersRepositories: BloggersRepositories) {}

  async execute(command: DeleteBloggerCommand): Promise<boolean> {
    const isDeleited = await this.bloggersRepositories.deleteBlogger(
      command.id,
    );
    if (isDeleited) {
      return isDeleited;
    }
    throw new NotFoundException(notFoundBlogger);
  }
}
