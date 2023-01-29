import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepositories } from '../../../users/infrastructure/users.repositories';
import { BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import { EmailManager } from '../adapters/email.manager';

export class ResendConfirmCodeUserCommand {
  constructor(public email: string) {}
}

@CommandHandler(ResendConfirmCodeUserCommand)
export class ResendConfirmCodeUserUseCase
  implements ICommandHandler<ResendConfirmCodeUserCommand>
{
  constructor(
    protected usersRepositories: UsersRepositories,
    protected emailManager: EmailManager,
  ) {}

  async execute(command: ResendConfirmCodeUserCommand) {
    const user = await this.usersRepositories.findUserByEmailOrLogin(
      command.email,
    );
    if (typeof user === 'string') {
      throw new BadRequestException([
        { message: 'user email doesnt exist', field: 'email' },
      ]);
    }

    await user.checkConfirmed();
    const confirmationCode = uuidv4();
    const expirationDate = add(new Date(), {
      hours: 1,
      minutes: 2,
    });
    user.emailConfirmation.confirmationCode = confirmationCode;
    user.emailConfirmation.expirationDate = expirationDate;
    await this.usersRepositories.saveUser(user);
    try {
      await this.emailManager.resentEmailConfirmationMessage(
        command.email,
        confirmationCode,
      );
      return;
    } catch (error) {
      console.error(error);

      return true;
    }
  }
}
