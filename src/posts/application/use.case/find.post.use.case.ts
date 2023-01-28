import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { PostsRepositories } from '../../infrastructure/posts.repositories';
import { PostsResponseType } from '../../posts.types';

export class FindPostCommand {
  constructor(public id: ObjectId) {}
}

@CommandHandler(FindPostCommand)
export class FindPostUseCase implements ICommandHandler<FindPostCommand> {
  constructor(protected postRepositories: PostsRepositories) {}

  async execute(command: FindPostCommand): Promise<PostsResponseType | string> {
    return this.postRepositories.findPostById(command.id);
  }
}
