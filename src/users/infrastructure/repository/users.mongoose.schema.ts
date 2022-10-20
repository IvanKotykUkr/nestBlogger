import mongoose, { Document } from 'mongoose';
import { UserDBType } from '../../users.types';
import { ObjectId } from 'mongodb';

export const UsersSchema = new mongoose.Schema<UserDBType>(
  {
    _id: ObjectId,
    accountData: {
      login: String,
      email: String,
      passwordHash: String,
      passwordSalt: String,
      createdAt: Date,
    },
    emailConfirmation: {
      confirmationCode: String,
      expirationDate: Date,
      isConfirmed: Boolean,
    },
    createdAt: Date,
  },
  {
    versionKey: false,
  },
);
export type UsersDocument = UserDBType & Document;
