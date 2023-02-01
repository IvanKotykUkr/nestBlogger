import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepositories } from '../../../users/infrastructure/users.repositories';
import { IdValidation } from '../../../users/users.types';
import { validate } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { UsersHelper } from '../../../users/application/users.helper';

export class NewPasswordUserCommand {
  constructor(
    public newPassword: string,
    public recoveryCode: string,
    public ip: string,
  ) {}
}

@CommandHandler(NewPasswordUserCommand)
export class NewPasswordUserUseCase
  implements ICommandHandler<NewPasswordUserCommand>
{
  constructor(
    protected usersRepositories: UsersRepositories,
    protected userHelper: UsersHelper,
  ) {}

  async execute(command: NewPasswordUserCommand) {
    const userId = this.decodeRecoveryCode(command.recoveryCode);
    const checkId = this.validateId(userId);
    if (typeof checkId === 'string') {
      throw new BadRequestException([
        { message: 'incorrect code', field: 'recoveryCode' },
      ]);
    }
    const user = await this.usersRepositories.findById(new ObjectId(userId));
    if (!user) {
      throw new BadRequestException([
        { message: 'incorrect code', field: 'recoveryCode' },
      ]);
    }
    await user.checkPasswordRecoveryStatus();
    await user.checkExpirationPasswordRecoveryCode();
    const newHash = await this.userHelper.generateHash(
      command.newPassword,
      user.accountData.passwordSalt,
    );
    user.accountData.passwordHash = newHash;
    user.passwordRecovery.isRecovered = true;
    user.passwordRecovery.recoveryDate = new Date();
    user.passwordRecovery.ip = command.ip;
    await this.usersRepositories.saveUser(user);
    return;
  }

  private validateId(userId: string) {
    const id = new IdValidation();
    id.userId = userId;
    return validate(id).then((errors) => {
      if (errors.length > 0) {
        return 'incorrect';
      } else {
        return;
      }
    });
  }

  private decodeRecoveryCode(code: string) {
    return Buffer.from(code, 'base64').toString('binary');
  }
}
