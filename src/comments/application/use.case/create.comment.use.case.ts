import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ObjectId } from "mongodb";
import { CommentResponseType, CommentsDBType } from "../../comments.types";
import { CommentsRepositories } from "../../infrastructure/comments.repositories";

export class CreateCommentCommand {
  constructor(
    public id: ObjectId,
    public content: string,
    public userId: ObjectId,
    public userLogin: string
  ) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(protected commentsRepositories: CommentsRepositories) {}

  async execute(
    command: CreateCommentCommand
  ): Promise<CommentResponseType | string> {
    const comment = this.makeComment(
      command.content,
      command.userId,
      command.userLogin,
      command.id
    );
    return this.commentsRepositories.createComment(comment);
  }

  private makeComment(
    content: string,
    userId: ObjectId,
    userLogin: string,
    postId: ObjectId
  ): CommentsDBType {
    return {
      _id: new ObjectId(),
      content,
      userId,
      userLogin,
      postId,
      createdAt: new Date(),
    };
  }
}
