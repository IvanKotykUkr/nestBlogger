import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { PostsRepositories } from '../../infrastructure/posts.repositories';
import { PostsResponseType } from '../../posts.types';
import { NotFoundException } from '@nestjs/common';

import { notFoundPost } from '../../../constants';

export class FindPostCommand {
  constructor(public id: ObjectId) {}
}

@CommandHandler(FindPostCommand)
export class FindPostUseCase implements ICommandHandler<FindPostCommand> {
  constructor(protected postRepositories: PostsRepositories) {}

  async execute(command: FindPostCommand): Promise<PostsResponseType> {
    const post = await this.postRepositories.findPostById(command.id);
    if (typeof post === 'string') {
      throw new NotFoundException(notFoundPost);
    }
    return post;
  }
}
