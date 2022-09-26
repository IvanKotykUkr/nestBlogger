import { Injectable } from '@nestjs/common';
import { QueryUsersRepositories } from '../users/query.users.repositories';
import { UsersHelper } from '../users/users.helper';
import { ObjectId } from 'mongodb';
import { UsersRepositories } from '../users/users.repositories';
import { EmailManager } from '../users/email.manager';

@Injectable()
export class AuthService {
  constructor(
    protected userHelper: UsersHelper,
    protected queryUsersRepositories: QueryUsersRepositories,
    protected usersRepositories: UsersRepositories,
    protected emailManager: EmailManager,
  ) {}

  async checkUser(login: string, password: string): Promise<ObjectId | string> {
    const user = await this.queryUsersRepositories.findUserByEmailOrLogin(
      login,
    );
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
}
