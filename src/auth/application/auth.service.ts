import { Injectable } from '@nestjs/common';
import { UsersHelper } from '../../users/application/users.helper';
import { ObjectId } from 'mongodb';
import { UsersRepositories } from '../../users/infrastructure/users.repositories';
import { EmailManager } from './adapters/email.manager';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';

@Injectable()
export class AuthService {
  constructor(
    protected userHelper: UsersHelper,
    protected usersRepositories: UsersRepositories,
    protected emailManager: EmailManager,
  ) {}

  async checkUser(login: string, password: string): Promise<ObjectId | string> {
    const user = await this.usersRepositories.findUserByEmailOrLogin(login);
    if (typeof user === 'string') return user;
    const passwordHash = await this.userHelper.generateHash(
      password,
      user.accountData.passwordSalt,
    );
    if (user.accountData.passwordHash !== passwordHash) {
      return 'password wrong';
    }
    return user._id;
  }

  async createUser(login: string, email: string, password: string) {
    const user = await this.userHelper.makeUser(login, email, password);
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
    return;
  }

  async confirmUser(code: string): Promise<string | boolean> {
    return this.usersRepositories.confirmUser(code);
  }

  async resendConfirmationCode(email: string) {
    const user = await this.usersRepositories.findUserByEmailOrLogin(email);
    if (typeof user === 'string') {
      return user;
    }
    if (user.emailConfirmation.isConfirmed === true) return 'already confirmed';

    const confirmationCode = uuidv4();
    const expirationDate = add(new Date(), {
      hours: 1,
      minutes: 2,
    });
    const code = await this.usersRepositories.renewConfirmationCode(
      email,
      confirmationCode,
      expirationDate,
    );

    try {
      await this.emailManager.resentEmailConfirmationMessage(
        email,
        confirmationCode,
      );
      return 'allOk';
    } catch (error) {
      console.error(error);

      return true;
    }
  }
}
