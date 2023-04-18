import { BloggersRepositories } from '../../infrastructure/bloggers.repositories';
import { ObjectId } from 'mongodb';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { notFoundBlogger } from '../../../constants';

export class UpdateBloggerCommand {
  constructor(
    public blogId: ObjectId,
    public name: string,
    public websiteUrl: string,
    public description: string,
  ) {}
}

@CommandHandler(UpdateBloggerCommand)
export class UpdateBloggerUseCase
  implements ICommandHandler<UpdateBloggerCommand>
{
  constructor(protected bloggersRepositories: BloggersRepositories) {}

  async execute(command: UpdateBloggerCommand): Promise<boolean> {
    const blogger = await this.bloggersRepositories.findById(command.blogId);
    if (!blogger) throw new NotFoundException(notFoundBlogger);
    blogger.name = command.name;
    blogger.description = command.description;
    blogger.websiteUrl = command.websiteUrl;
    await this.bloggersRepositories.save(blogger);
    return;
  }
}
