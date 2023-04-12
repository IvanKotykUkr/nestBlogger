import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { CommentsRepositories } from '../../infrastructure/comments.repositories';
import { CommentResponseType } from '../../comments.types';
import { NotFoundException } from '@nestjs/common';

export class FindCommentCommand {
  constructor(public id: ObjectId) {}
}

@CommandHandler(FindCommentCommand)
export class FindCommentUseCase implements ICommandHandler<FindCommentCommand> {
  constructor(protected commentsRepositories: CommentsRepositories) {}

  async execute(command: FindCommentCommand): Promise<CommentResponseType> {
    const comment = await this.commentsRepositories.findCommentsById(
      command.id,
    );
    if (typeof comment === 'string') {
      throw new NotFoundException([
        {
          message: 'comment with specified id doesnt exists',
          field: 'comment Id',
        },
      ]);
    }
    return comment;
  }
}
