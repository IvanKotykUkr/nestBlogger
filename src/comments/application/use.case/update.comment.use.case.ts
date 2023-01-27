import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ObjectId } from "mongodb";
import { CommentsRepositories } from "../../infrastructure/comments.repositories";

export class UpdateCommentCommand {
  constructor(public id: ObjectId, public content: string) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(protected commentsRepositories: CommentsRepositories) {}

  async execute(command: UpdateCommentCommand): Promise<boolean> {
    return this.commentsRepositories.updateComment(command.id, command.content);
  }
}
