import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepositories } from '../../../users/infrastructure/users.repositories';
import { UnauthorizedException } from '@nestjs/common';
import { UsersHelper } from '../../../users/application/users.helper';
import { User } from '../../../users/infrastructure/repository/users.mongoose.schema';

export class ValidateUserCommand {
  constructor(public login: string, public password: string) {}
}

@CommandHandler(ValidateUserCommand)
export class ValidateUserUseCase
  implements ICommandHandler<ValidateUserCommand>
{
  constructor(
    protected usersRepositories: UsersRepositories,
    protected userHelper: UsersHelper,
  ) {}

  async execute(command: ValidateUserCommand): Promise<User> {
    const user = await this.usersRepositories.findUserByEmailOrLogin(
      command.login,
    );
    if (typeof user === 'string') {
      throw new UnauthorizedException([
        {
          message: 'WRONG LOGIN',
          field: 'login',
        },
      ]);
    }
    const passwordHash = await this.userHelper.generateHash(
      command.password,
      user.accountData.passwordSalt,
    );
    user.comparePassword(passwordHash);
    return user;
  }
}
