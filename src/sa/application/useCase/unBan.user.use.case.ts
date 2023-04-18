import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { UsersRepositories } from '../../../users/infrastructure/users.repositories';
import { UnauthorizedException } from '@nestjs/common';

export class UnBanUserCommand {
  constructor(public userId: ObjectId) {}
}

@CommandHandler(UnBanUserCommand)
export class UnBanUserUseCase implements ICommandHandler<UnBanUserCommand> {
  constructor(protected usersRepositories: UsersRepositories) {}

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
    ///check and add to invisible  post,comment and like
    return;
  }
}
