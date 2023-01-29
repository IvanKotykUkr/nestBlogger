import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepositories } from '../../../users/infrastructure/users.repositories';
import { EmailManager } from '../adapters/email.manager';
import { ObjectId } from 'mongodb';
import { UserDocument } from '../../../users/infrastructure/repository/users.mongoose.schema';
import add from 'date-fns/add';

export class RecoveryPasswordUserCommand {
  constructor(public email: string, public ip: string, public date: Date) {}
}

@CommandHandler(RecoveryPasswordUserCommand)
export class RecoveryPasswordUserUseCase
  implements ICommandHandler<RecoveryPasswordUserCommand>
{
  constructor(
    protected usersRepositories: UsersRepositories,
    protected emailManager: EmailManager,
  ) {}

  async execute(command: RecoveryPasswordUserCommand) {
    const user = await this.usersRepositories.findByEmail(command.email);
    if (!user) return;
    this.makeRecoveryCode(user, command.ip, command.date);
    await this.usersRepositories.saveUser(user);
    await this.emailManager.sendPasswordRecoveryCode(
      command.email,
      user.passwordRecovery.recoveryCode,
    );
    return;
  }

  private makeRecoveryCode(
    user: UserDocument,
    ip: string,
    date: Date,
  ): UserDocument {
    const code = this.encodeRecoveryCode(user._id);
    user.passwordRecovery.recoveryCode = code;
    user.passwordRecovery.recoveryDate = date;
    user.passwordRecovery.ip = ip;
    user.passwordRecovery.expirationCode = add(new Date(), {
      hours: 1,
      minutes: 2,
    });
    user.passwordRecovery.isRecovered = false;
    return user;
  }

  private encodeRecoveryCode(userId: ObjectId) {
    const code = Buffer.from(userId.toString(), 'binary').toString('base64');
    return code;
  }
}
