import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ObjectId } from "mongodb";
import { PostsRepositories } from "../../infrastructure/posts.repositories";

export class DeletePostCommand {
  constructor(public id: ObjectId) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(protected postRepositories: PostsRepositories) {}

  async execute(command: DeletePostCommand): Promise<boolean | string> {
    return this.postRepositories.deletePost(command.id);
  }
}
