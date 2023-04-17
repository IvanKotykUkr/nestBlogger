import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserResponseType, UserDBType } from '../../users.types';
import * as bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import { UsersRepositories } from '../../infrastructure/users.repositories';
import { UsersHelper } from '../users.helper';
import { EmailManager } from '../../../auth/application/adapters/email.manager';

export class CreateUserCommand {
  constructor(
    public login: string,
    public email: string,
    public password: string,
  ) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    protected userHelper: UsersHelper,
    protected usersRepositories: UsersRepositories,
    protected emailManager: EmailManager,
  ) {}

  async execute(command: CreateUserCommand): Promise<CreateUserResponseType> {
    const user = await this.makeUser(
      command.login,
      command.email,
      command.password,
    );
    await this.usersRepositories.createUser(user);
    try {
      await this.emailManager.sendEmailConfirmationMessage(
        user.accountData.email,
        user.emailConfirmation.confirmationCode,
      );
    } catch (error) {
      console.error(error);

      await this.usersRepositories.deleteUser(user._id);
    }
    return {
      id: user._id,
      login: user.accountData.login,
      email: user.accountData.email,
      banInfo: user.banInfo,
      createdAt: user.createdAt,
    };
  }

  private async makeUser(
    login: string,
    email: string,
    password: string,
  ): Promise<UserDBType> {
    const passwordSalt: string = await bcrypt.genSalt(10);
    const passwordHash: string = await this.userHelper.generateHash(
      password,
      passwordSalt,
    );

    const newUser: UserDBType = {
      _id: new ObjectId(),
      accountData: {
        login,
        email,
        passwordHash,
        passwordSalt,
        createdAt: new Date(),
      },
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 2,
        }),
        isConfirmed: false,
      },
      banInfo: {
        isBanned: false,
      },
      createdAt: new Date(),
    };
    return newUser;
  }
}
