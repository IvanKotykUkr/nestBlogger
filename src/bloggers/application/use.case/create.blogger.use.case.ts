import { BloggersRepositories } from "../../infrastructure/bloggers.repositories";
import { BloggerType } from "../../bloggers.types";
import { ObjectId } from "mongodb";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

export class CreateBloggerCommand {
  constructor(
    public name: string,
    public websiteUrl: string,
    public description: string
  ) {}
}

@CommandHandler(CreateBloggerCommand)
export class CreateBloggerUseCase
  implements ICommandHandler<CreateBloggerCommand>
{
  constructor(protected bloggersRepositories: BloggersRepositories) {}

  async execute(command: CreateBloggerCommand): Promise<BloggerType> {
    const blogger = this.makeBlogger(
      command.name,
      command.websiteUrl,
      command.description
    );
    return this.bloggersRepositories.createBlogger(blogger);
  }

  private makeBlogger(
    name: string,
    websiteUrl: string,
    description: string
  ): BloggerType {
    const newBlogger: BloggerType = {
      _id: new ObjectId(),
      name,
      description,
      websiteUrl,
      createdAt: new Date(),
    };

    return newBlogger;
  }
}
