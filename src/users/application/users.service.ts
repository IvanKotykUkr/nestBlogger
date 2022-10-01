import { Injectable } from '@nestjs/common';
import { UsersHelper } from './users.helper';
import { UsersResponseType } from '../users.types';
import { UsersRepositories } from '../infrastructure/users.repositories';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersService {
  constructor(
    protected usersHelper: UsersHelper,
    protected usersRepositories: UsersRepositories,
  ) {}

  async createUsers(
    login: string,
    email: string,
    password: string,
  ): Promise<UsersResponseType> {
    const newUser = await this.usersHelper.makeUser(login, email, password);

    await this.usersRepositories.createUser(newUser);
    return { id: newUser._id, login: newUser.accountData.login };
  }

  async deleteUsers(id: ObjectId): Promise<boolean> {
    return this.usersRepositories.deleteUser(id);
  }
}
