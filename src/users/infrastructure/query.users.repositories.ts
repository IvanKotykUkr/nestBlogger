import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './repository/users.mongoose.schema';
import { Model } from 'mongoose';
import { UserDBType, UsersResponseType } from '../users.types';
import { ObjectId } from 'mongodb';
import { UsersSearchCountParams } from '../../sa/sa.types';

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

  async findAllUsers(
    filter: UsersSearchCountParams,
    sortBy: string,
    sortDirection: string,
    pageSize: number,
    page: number,
  ): Promise<UsersResponseType[]> {
    const direction = this.getDirection(sortDirection);
    const users = await this.UsersModel.find(filter)
      .skip(page > 0 ? (page - 1) * pageSize : 0)
      .sort({ [sortBy]: direction })
      .limit(pageSize)
      .lean();
    return users.map((u) => ({
      id: u._id,
      login: u.accountData.login,
      email: u.accountData.email,
      banInfo: {
        isBanned: u.banInfo.isBanned,
        banReason: u.banInfo.banReason,
        banDate: u.banInfo.banDate,
      },
      createdAt: u.createdAt,
    }));
  }

  async findUserById(_id: ObjectId): Promise<User> {
    return this.UsersModel.findById(_id);
  }

  async usersSearchCount(filter: UsersSearchCountParams): Promise<number> {
    return this.UsersModel.countDocuments(filter);
  }

  private getDirection(sortDirection: string) {
    if (sortDirection.toString() === 'asc') {
      return 1;
    }
    if (sortDirection.toString() === 'desc') {
      return -1;
    }
  }
}
