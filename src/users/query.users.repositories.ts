import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersDocument } from '../schema/mongoose.app.schema';
import {
  UserDBType,
  UserRequestType,
  UsersResponseType,
  UsersWithPaginationResponseType,
} from '../types/users.types';
import { ObjectId } from 'mongodb';

export class QueryUsersRepositories {
  constructor(@InjectModel('users') private UsersModel: Model<UsersDocument>) {}

  reqUsers(user: UserDBType) {
    return {
      _id: user._id,
      accountData: user.accountData,
      emailConfirmation: user.emailConfirmation,
    };
  }

  async findAllUsersWithPagination(
    pagenumber: number,
    pagesize: number,
  ): Promise<UsersWithPaginationResponseType> {
    const page: number = pagenumber;
    const pageSize: number = pagesize;
    const totalCountSearch: number = await this.usersSearchCount();
    const pagesCountSearch: number = Math.ceil(totalCountSearch / pageSize);
    const itemsSearch: UsersResponseType[] = await this.findAllUsers(
      pageSize,
      page,
    );
    return {
      pagesCount: pagesCountSearch,
      page,
      pageSize,
      totalCount: totalCountSearch,
      items: itemsSearch,
    };
  }

  async findAllUsers(
    size: number,
    number: number,
  ): Promise<UsersResponseType[]> {
    const users = await this.UsersModel.find()
      .skip(number > 0 ? (number - 1) * size : 0)
      .limit(size)
      .lean();
    return users.map((u) => ({ id: u._id, login: u.accountData.login }));
  }

  async findUserByEmailOrLogin(login: string): Promise<UserDBType | string> {
    const user = await this.UsersModel.findOne({
      $or: [{ 'accountData.login': login }, { 'accountData.email': login }],
    });
    if (user) {
      return this.reqUsers(user);
    }

    return 'not found users';
  }

  async findUserById(_id: ObjectId): Promise<UserRequestType | string> {
    const user = await this.UsersModel.findById(_id);
    if (!user) {
      return 'not found';
    }
    return {
      id: user.id,
      login: user.accountData.login,
      email: user.accountData.email,
      passwordHash: user.accountData.passwordHash,
      passwordSalt: user.accountData.passwordSalt,
      createdAt: user.accountData.createdAt,
    };
  }

  async checkUseLoginOrEmail(
    login: string,
    email: string,
  ): Promise<UserDBType | string> {
    const user = await this.UsersModel.findOne({
      $or: [{ 'accountData.login': login }, { 'accountData.email': email }],
    });
    if (user) {
      return this.reqUsers(user);
    }

    return 'not found users';
  }

  private async usersSearchCount(): Promise<number> {
    return this.UsersModel.countDocuments();
  }
}
