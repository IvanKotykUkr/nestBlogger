import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepositories } from '../../../users/infrastructure/users.repositories';
import { BadRequestException } from '@nestjs/common';

export class ConfirmCodeUserCommand {
  constructor(public code: string) {}
}

@CommandHandler(ConfirmCodeUserCommand)
export class ConfirmCodeUserUseCase
  implements ICommandHandler<ConfirmCodeUserCommand>
{
  return;

  constructor(protected usersRepositories: UsersRepositories) {}

  async execute(command: ConfirmCodeUserCommand) {
    const user = await this.usersRepositories.findUserByConfirmationCode(
      command.code,
    );
    if (!user) {
      throw new BadRequestException([
        { message: ' code doesnt exist', field: 'code' },
      ]);
    }
    user.checkConfirmed();
    user.checkExpirationCode();
    user.confirm();

    await this.usersRepositories.saveUser(user);
    return;
  }
}
