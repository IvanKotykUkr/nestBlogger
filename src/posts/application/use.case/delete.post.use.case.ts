import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { PostsRepositories } from '../../infrastructure/posts.repositories';
import { NotFoundException } from '@nestjs/common';

import { notFoundPost } from '../../../constants';

export class DeletePostCommand {
  constructor(public id: ObjectId) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(protected postRepositories: PostsRepositories) {}

  async execute(command: DeletePostCommand): Promise<boolean | string> {
    const isDeleted = await this.postRepositories.deletePost(command.id);
    if (typeof isDeleted !== 'string') {
      return isDeleted;
    }
    throw new NotFoundException(notFoundPost);
  }
}
