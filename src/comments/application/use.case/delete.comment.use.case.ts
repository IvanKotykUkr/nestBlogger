import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { CommentsRepositories } from '../../infrastructure/comments.repositories';

export class DeleteCommentCommand {
  constructor(public id: ObjectId) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(protected commentsRepositories: CommentsRepositories) {}

  async execute(command: DeleteCommentCommand): Promise<boolean> {
    return this.commentsRepositories.deleteComment(command.id);
  }
}
