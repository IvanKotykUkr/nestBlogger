import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { UsersRepositories } from '../../../users/infrastructure/users.repositories';
import { UnauthorizedException } from '@nestjs/common';
import { PostsRepositories } from '../../../posts/infrastructure/posts.repositories';
import { CommentsRepositories } from '../../../comments/infrastructure/comments.repositories';
import { LikesRepositories } from '../../../comments/infrastructure/likes.repositories';

export class UnBanUserCommand {
  constructor(public userId: ObjectId) {}
}

@CommandHandler(UnBanUserCommand)
export class UnBanUserUseCase implements ICommandHandler<UnBanUserCommand> {
  constructor(
    protected usersRepositories: UsersRepositories,
    protected postRepositories: PostsRepositories,
    protected commentRepositories: CommentsRepositories,
    protected likesRepositories: LikesRepositories,
  ) {}

  async execute(command: UnBanUserCommand) {
    const user = await this.usersRepositories.findById(command.userId);
    if (!user) {
      throw new UnauthorizedException([
        { message: 'there is no user', field: 'userId' },
      ]);
    }
    user.checkAlreadyUnBan();
    user.UnBanUser();
    await this.usersRepositories.saveUser(user);
    await this.postRepositories.makePostVisible(command.userId);
    await this.commentRepositories.makeCommentVisible(command.userId);
    await this.likesRepositories.makeLikeVisible(command.userId);
    return;
  }
}
