import { BloggersRepositories } from '../../infrastructure/bloggers.repositories';
import { BloggerResponseType, BloggerType } from '../../bloggers.types';
import { ObjectId } from 'mongodb';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepositories } from '../../../users/infrastructure/users.repositories';
import { NotFoundException } from '@nestjs/common';
import { notFoundUser } from '../../../constants';

export class CreateBloggerCommand {
  constructor(
    public name: string,
    public websiteUrl: string,
    public description: string,
    public userId: ObjectId,
  ) {}
}

@CommandHandler(CreateBloggerCommand)
export class CreateBloggerUseCase
  implements ICommandHandler<CreateBloggerCommand>
{
  constructor(
    protected bloggersRepositories: BloggersRepositories,
    protected userRepositories: UsersRepositories,
  ) {}

  async execute(command: CreateBloggerCommand): Promise<BloggerResponseType> {
    const blogger = await this.makeBlogger(
      command.name,
      command.websiteUrl,
      command.description,
      command.userId,
    );
    return this.bloggersRepositories.createBlogger(blogger);
  }

  private async makeBlogger(
    name: string,
    websiteUrl: string,
    description: string,
    ownerId: ObjectId,
  ): Promise<BloggerType> {
    const user = await this.userRepositories.findUserById(
      new ObjectId(ownerId),
    );
    if (typeof user === 'string') {
      throw new NotFoundException(notFoundUser);
    }
    const newBlogger: BloggerType = {
      _id: new ObjectId(),
      name,
      description,
      websiteUrl,
      blogOwnerInfo: {
        userId: ownerId,
        userLogin: user.login,
      },
      createdAt: new Date(),
      isMembership: true,
    };

    return newBlogger;
  }
}
