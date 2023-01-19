import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { CommentsRepositories } from '../../infrastructure/comments.repositories';
import { CommentResponseType } from '../../comments.types';

export class FindCommentCommand {
  constructor(public id: ObjectId) {}
}

@CommandHandler(FindCommentCommand)
export class FindCommentUseCase implements ICommandHandler<FindCommentCommand> {
  constructor(protected commentsRepositories: CommentsRepositories) {}

  async execute(
    command: FindCommentCommand,
  ): Promise<CommentResponseType | string> {
    return this.commentsRepositories.findCommentsById(command.id);
  }
}
