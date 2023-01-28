import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DevicesDocument } from './repository/auth.devices.sessions.mongoose';
import { Model } from 'mongoose';
import { AuthDevicesTypeDTO, DevicesInfo } from './device.types';
import { ObjectId } from 'mongodb';
import process from 'process';

@Injectable()
export class AuthDevicesRepositories {
  constructor(
    @InjectModel('auth devices')
    private AuthDevicesModel: Model<DevicesDocument>,
  ) {}

  async saveDevice(device: AuthDevicesTypeDTO): Promise<DevicesInfo> {
    const newDevice = new this.AuthDevicesModel(device);
    await newDevice.save();
    const deviceInfo: DevicesInfo = {
      deviceId: device.deviceId,
      date: device.lastActiveDate,
    };
    return deviceInfo;
  }

  async checkDeviceForUser(
    title: string,
    userId: ObjectId,
    lastActiveDate: Date,
  ): Promise<string | DevicesInfo> {
    const device = await this.AuthDevicesModel.findOneAndUpdate(
      {
        $and: [{ userId }, { title }],
      },
      { lastActiveDate },
    ).lean();
    if (!device) {
      return ' not used';
    }
    //for test
    process.env.DATEDEVICE = lastActiveDate.toJSON();
    //
    const deviceInfo: DevicesInfo = {
      deviceId: device.deviceId,
      date: lastActiveDate,
    };
    return deviceInfo;
  }

  async checkToken(
    iat: number,
    deviceId: string,
    date: Date,
  ): Promise<DevicesInfo | string> {
    const device = await this.AuthDevicesModel.findOne({ deviceId });
    if (!device) {
      return 'dont have device id';
    }
    if (+device.lastActiveDate !== iat) {
      return 'invalid refreshToken';
    }
    device.lastActiveDate = date;
    await device.save();
    const deviceInfo = {
      deviceId: device.deviceId,
      date: device.lastActiveDate,
    };
    return deviceInfo;
  }

  async logoutDevice(userId: ObjectId, deviceId: string) {
    return this.AuthDevicesModel.findOneAndDelete({
      $and: [{ userId }, { deviceId }],
    });
  }

  async terminateAllSessionExceptCurrent(userId: ObjectId, device: string) {
    return this.AuthDevicesModel.deleteMany({
      $and: [{ userId }, { deviceId: { $ne: device } }],
    });
  }

  async deleteDevice(id: ObjectId, deviceId: string): Promise<string> {
    const device = await this.AuthDevicesModel.findOne({ deviceId });
    if (device === null) return 'not found';
    if (device.userId.toString() !== id.toString()) return 'forbidden';
    await device.deleteOne();
    return 'all good';
  }
}
