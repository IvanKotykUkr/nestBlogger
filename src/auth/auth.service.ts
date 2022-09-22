import { Injectable } from '@nestjs/common';
import { QueryUsersRepositories } from '../users/query.users.repositories';
import { UsersHelper } from '../users/users.helper';
import { ObjectId } from 'mongodb';

@Injectable()
export class AuthService {
  constructor(
    protected userHelper: UsersHelper,
    protected queryUsersRepositories: QueryUsersRepositories,
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
}
