import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDBType, UserRequestType } from '../users.types';
import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { UsersDocument } from './repository/users.mongoose.schema';

@Injectable()
export class UsersRepositories {
  constructor(@InjectModel('users') private UsersModel: Model<UsersDocument>) {}

  reqUsers(user: UserDBType) {
    return {
      _id: user._id,
      accountData: user.accountData,
      emailConfirmation: user.emailConfirmation,
      createdAt: user.createdAt,
    };
  }

  async createUser(newUser: UserDBType): Promise<UserDBType> {
    const userInstance = new this.UsersModel(newUser);
    userInstance.createdAt = new Date();
    await userInstance.save();
    return this.reqUsers(userInstance);
  }

  async deleteUser(_id: ObjectId): Promise<boolean> {
    const userInstance = await this.UsersModel.findById({ _id });
    if (!userInstance) return false;
    await userInstance.deleteOne();
    return true;
  }

  async confirmUser(code: string): Promise<string | boolean> {
    const user = await this.UsersModel.findOne({
      'emailConfirmation.confirmationCode': code,
    });
    if (!user) return 'not found';
    if (user.emailConfirmation.isConfirmed === true) return 'already confirmed';
    if (user.emailConfirmation.expirationDate < new Date()) {
      return 'code expired';
    }
    user.emailConfirmation.isConfirmed = true;
    await user.save();
    return true;
  }

  async renewConfirmationCode(
    email: string,
    confirmationCode: string,
    expirationDate: Date,
  ): Promise<boolean> {
    const result = await this.UsersModel.findOneAndUpdate(
      { 'accountData.email': email },
      {
        $set: {
          'emailConfirmation.confirmationCode': confirmationCode,
          'emailConfirmation.expirationDate': expirationDate,
        },
      },
    );
    return true;
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

  async findByEmail(email: string): Promise<UsersDocument> {
    return this.UsersModel.findOne({ 'accountData.email': email });
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

  async findById(_id: ObjectId): Promise<UsersDocument> {
    return this.UsersModel.findById(_id);
  }

  async saveUser(user: UsersDocument) {
    await user.save();
    return;
  }
}
