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
    const userInstance = new this.UsersModel(newUser);
    return userInstance.save();
  }

  async deleteUser(_id: ObjectId): Promise<boolean> {
    const userInstance = await this.UsersModel.findById({ _id });
    if (!userInstance) return false;
    await userInstance.deleteOne();
    return true;
  }
}
