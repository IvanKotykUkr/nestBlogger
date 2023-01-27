import { BloggersRepositories } from "../../infrastructure/bloggers.repositories";
import { ObjectId } from "mongodb";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BloggerType, BloggerTypeForUpdate } from "../../bloggers.types";

export class UpdateBloggerCommand {
  constructor(
    public blogId: ObjectId,
    public name: string,
    public websiteUrl: string,
    public description: string
  ) {}
}

@CommandHandler(UpdateBloggerCommand)
export class UpdateBloggerUseCase
  implements ICommandHandler<UpdateBloggerCommand>
{
  constructor(protected bloggersRepositories: BloggersRepositories) {}

  async execute(command: UpdateBloggerCommand): Promise<boolean> {
    const newBlogger = this.updateBlogger(
      command.blogId,
      command.name,
      command.websiteUrl,
      command.description
    );
    return this.bloggersRepositories.updateBlogger(newBlogger);
  }

  private updateBlogger(
    blogId: ObjectId,
    name: string,
    websiteUrl: string,
    description: string
  ): BloggerTypeForUpdate {
    const newBlogger: BloggerType = {
      _id: blogId,
      name,
      description,
      websiteUrl,
      createdAt: new Date(),
    };
    return newBlogger;
  }
}
