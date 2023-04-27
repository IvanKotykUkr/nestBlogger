import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepositories } from '../../../users/infrastructure/users.repositories';
import { UnauthorizedException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { AuthDevicesRepositories } from '../../../securitydevices/infrastructure/auth.devices.repositories';
import { PostsRepositories } from '../../../posts/infrastructure/posts.repositories';
import { CommentsRepositories } from '../../../comments/infrastructure/comments.repositories';
import { LikesRepositories } from '../../../comments/infrastructure/likes.repositories';

export class BanUserCommand {
  constructor(public userId: ObjectId, public banReason: string) {}
}

@CommandHandler(BanUserCommand)
export class BanUserUseCase implements ICommandHandler<BanUserCommand> {
  constructor(
    protected usersRepositories: UsersRepositories,
    protected authDevicesRepositories: AuthDevicesRepositories,
    protected postRepositories: PostsRepositories,
    protected commentRepositories: CommentsRepositories,
    protected likesRepositories: LikesRepositories,
  ) {}

  async execute(command: BanUserCommand) {
    const user = await this.usersRepositories.findById(command.userId);
    if (!user) {
      throw new UnauthorizedException([
        { message: 'there is no user', field: 'userId' },
      ]);
    }

    user.checkAlreadyBanned();
    user.banUser(command.banReason);
    await this.usersRepositories.saveUser(user);
    await this.authDevicesRepositories.deleteAllDeviceForCurrentUser(
      command.userId,
    );
    await this.postRepositories.makePostInvisible(command.userId);
    await this.commentRepositories.makeCommentInvisible(command.userId);
    await this.likesRepositories.makeLikeInvisible(command.userId);
    return;
  }
}
