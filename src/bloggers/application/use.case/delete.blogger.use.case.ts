import { BloggersRepositories } from '../../infrastructure/bloggers.repositories';
import { ObjectId } from 'mongodb';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class DeleteBloggerCommand {
  constructor(public id: ObjectId) {}
}

@CommandHandler(DeleteBloggerCommand)
export class DeleteBloggerUseCase
  implements ICommandHandler<DeleteBloggerCommand>
{
  constructor(protected bloggersRepositories: BloggersRepositories) {}

  async execute(command: DeleteBloggerCommand): Promise<boolean> {
    return this.bloggersRepositories.deleteBlogger(command.id);
  }
}
