import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./repository/users.mongoose.schema";
import { Model } from "mongoose";
import { UserDBType, UserRequestType } from "../users.types";
import { ObjectId } from "mongodb";

@Injectable()
export class UsersRepositories {
  constructor(
    @InjectModel(User.name) private UsersModel: Model<UserDocument>
  ) {}

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

  async findUserByEmailOrLogin(login: string): Promise<UserDocument | string> {
    const user = await this.UsersModel.findOne({
      $or: [{ "accountData.login": login }, { "accountData.email": login }],
    });
    if (user) {
      return user;
    }

    return "not found users";
  }

  async checkUseLoginOrEmail(
    login: string,
    email: string
  ): Promise<UserDBType | string> {
    const user = await this.UsersModel.findOne({
      $or: [{ "accountData.login": login }, { "accountData.email": email }],
    });
    if (user) {
      return user;
    }

    return "not found users";
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.UsersModel.findOne({ "accountData.email": email });
  }

  async findUserById(_id: ObjectId): Promise<UserRequestType | string> {
    const user = await this.UsersModel.findById(_id);
    if (!user) {
      return "not found";
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

  async findById(_id: ObjectId): Promise<UserDocument> {
    return this.UsersModel.findById(_id);
  }

  async saveUser(user: UserDocument) {
    await user.save();
    return;
  }

  async findUserByConfirmationCode(code: string): Promise<UserDocument> {
    return this.UsersModel.findOne({
      "emailConfirmation.confirmationCode": code,
    });
  }
}
