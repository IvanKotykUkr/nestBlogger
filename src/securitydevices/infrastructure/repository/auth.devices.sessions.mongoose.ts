import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { AuthDevicesType } from '../device.types';

export const AuthDevicesSchema = new mongoose.Schema<AuthDevicesType>(
  {
    _id: ObjectId,
    ip: String,
    title: String,
    lastActiveDate: Date,
    deviceId: String,
    userId: ObjectId,
  },
  {
    versionKey: false,
  },
);

export type DevicesDocument = AuthDevicesType & Document;
