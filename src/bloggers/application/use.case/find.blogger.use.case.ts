import { BloggersRepositories } from "../../infrastructure/bloggers.repositories";
import { BloggerResponseType } from "../../bloggers.types";
import { ObjectId } from "mongodb";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

export class FindBloggerCommand {
  constructor(public id: ObjectId) {}
}

@CommandHandler(FindBloggerCommand)
export class FindBloggerUseCase implements ICommandHandler<FindBloggerCommand> {
  constructor(protected bloggersRepositories: BloggersRepositories) {}

  async execute(
    command: FindBloggerCommand
  ): Promise<BloggerResponseType | string> {
    return this.bloggersRepositories.findBlogger(command.id);
  }
}
