import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  UserDBType,
  UsersResponseType,
  UsersWithPaginationResponseType,
} from '../users.types';
import { UsersDocument } from './repository/users.mongoose.schema';

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

  private async usersSearchCount(): Promise<number> {
    return this.UsersModel.countDocuments();
  }
}
