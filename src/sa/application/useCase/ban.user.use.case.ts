import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepositories } from '../../../users/infrastructure/users.repositories';
import { UnauthorizedException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { AuthDevicesRepositories } from '../../../securitydevices/infrastructure/auth.devices.repositories';

export class BanUserCommand {
  constructor(public userId: ObjectId, public banReason: string) {}
}

@CommandHandler(BanUserCommand)
export class BanUserUseCase implements ICommandHandler<BanUserCommand> {
  constructor(
    protected usersRepositories: UsersRepositories,
    protected authDevicesRepositories: AuthDevicesRepositories,
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
    ///check and add to invisible  post,comment and like
    return;
  }
}
