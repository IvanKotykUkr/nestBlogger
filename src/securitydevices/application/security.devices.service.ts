import { Injectable } from '@nestjs/common';
import { AuthDevicesRepositories } from '../infrastructure/auth.devices.repositories';
import { ObjectId } from 'mongodb';
import {
  AuthDevicesTypeDTO,
  DevicesInfo,
} from '../infrastructure/device.types';
import * as uuid from 'uuid';
import * as process from 'process';

@Injectable()
export class SecurityDevicesService {
  constructor(protected authDevicesRepositories: AuthDevicesRepositories) {}

  async addDevice(
    deviceName: string,
    ip: string,
    userId: ObjectId,
    date: Date,
  ): Promise<DevicesInfo> {
    const usedDevice: string | DevicesInfo =
      await this.authDevicesRepositories.checkDeviceForUser(
        deviceName,
        userId,
        date,
      );
    if (typeof usedDevice === 'string') {
      return this.addNewDevice(deviceName, ip, userId, date);
    }

    return usedDevice;
  }

  async terminateAllSessionExceptCurrent(userId: ObjectId, deviceId: string) {
    return this.authDevicesRepositories.terminateAllSessionExceptCurrent(
      userId,
      deviceId,
    );
  }

  async deleteDevice(userId: ObjectId, deviceId: string): Promise<string> {
    return this.authDevicesRepositories.deleteDevice(userId, deviceId);
  }

  private makeDeviceDTO(
    device: string,
    ip: string,
    userId: ObjectId,
    date: Date,
  ): AuthDevicesTypeDTO {
    return {
      _id: new ObjectId(),
      ip,
      title: device,
      lastActiveDate: date,
      userId,
      deviceId: uuid.v4(),
    };
  }

  private async addNewDevice(
    deviceName: string,
    ip: string,
    userId: ObjectId,
    date: Date,
  ): Promise<DevicesInfo> {
    const device: AuthDevicesTypeDTO = this.makeDeviceDTO(
      deviceName,
      ip,
      userId,
      date,
    );
    //for test
    process.env.DEVICEID = device.deviceId;
    process.env.DATEDEVICE = device.lastActiveDate.toJSON();
    //

    return this.authDevicesRepositories.saveDevice(device);
  }
}
