import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersDocument } from '../schema/mongoose.app.schema';
import { UserDBType } from '../types/users.types';
import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersRepositories {
  constructor(@InjectModel('users') private UsersModel: Model<UsersDocument>) {}

  async createUser(newUser: UserDBType): Promise<UserDBType> {
    const userInstance = new this.UsersModel();
    userInstance._id = newUser._id;
    userInstance.accountData.login = newUser.accountData.login;
    userInstance.accountData.email = newUser.accountData.email;
    userInstance.accountData.passwordHash = newUser.accountData.passwordHash;
    userInstance.accountData.passwordSalt = newUser.accountData.passwordSalt;
    userInstance.accountData.createdAt = newUser.accountData.createdAt;
    userInstance.emailConfirmation.confirmationCode =
      newUser.emailConfirmation.confirmationCode;
    userInstance.emailConfirmation.expirationDate =
      newUser.emailConfirmation.expirationDate;
    userInstance.emailConfirmation.isConfirmed =
      newUser.emailConfirmation.isConfirmed;
    await userInstance.save();
    return;
  }

  async deleteUser(_id: ObjectId): Promise<boolean> {
    const userInstance = await this.UsersModel.findById({ _id });
    if (!userInstance) return false;
    await userInstance.deleteOne();
    return true;
  }
}
