import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepositories } from '../../../users/infrastructure/users.repositories';
import { UnauthorizedException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { BloggersRepositories } from '../../../bloggers/infrastructure/bloggers.repositories';

export class BinUserCommand {
  constructor(public blogId: ObjectId, public userId: ObjectId) {}
}

@CommandHandler(BinUserCommand)
export class BinUserUseCase implements ICommandHandler<BinUserCommand> {
  constructor(
    protected usersRepositories: UsersRepositories,
    protected blogsRepositories: BloggersRepositories,
    protected commandBus: CommandBus,
  ) {}

  async execute(command: BinUserCommand) {
    const user = await this.usersRepositories.findById(command.userId);
    if (!user) {
      throw new UnauthorizedException([
        { message: 'there is no user', field: 'userId' },
      ]);
    }
    const blog = await this.blogsRepositories.findById(command.blogId);
    if (!blog) {
      throw new UnauthorizedException([
        { message: 'there is no blog', field: 'blogId' },
      ]);
    }
    if (!blog.ownerId)
      throw new UnauthorizedException([
        { message: 'there is no user', field: 'userId' },
      ]);
    blog.ownerId = command.userId;
    await this.blogsRepositories.save(blog);
    return;
  }
}
