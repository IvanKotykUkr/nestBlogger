import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './repository/users.mongoose.schema';
import { Model } from 'mongoose';
import {
  UserDBType,
  UsersResponseType,
  UsersWithPaginationResponseType,
} from '../users.types';

@Injectable()
export class QueryUsersRepositories {
  constructor(
    @InjectModel(User.name) private UsersModel: Model<UserDocument>,
  ) {}

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
    return users.map((u) => ({
      id: u._id,
      login: u.accountData.login,
      email: u.accountData.email,
      createdAt: u.createdAt,
    }));
  }

  private async usersSearchCount(): Promise<number> {
    return this.UsersModel.countDocuments();
  }
}
