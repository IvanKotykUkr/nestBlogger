import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthDevicesRepositories } from '../../../securitydevices/infrastructure/auth.devices.repositories';
import { ObjectId } from 'mongodb';
import {
  AuthDevicesTypeDTO,
  DevicesInfo,
} from '../../../securitydevices/infrastructure/device.types';
import * as uuid from 'uuid';

export class AddDeviceUserCommand {
  constructor(
    public userId: ObjectId,
    public deviceName: string,
    public ip: string,
  ) {}
}

@CommandHandler(AddDeviceUserCommand)
export class AddDeviceUserUseCase
  implements ICommandHandler<AddDeviceUserCommand>
{
  constructor(protected authDevicesRepositories: AuthDevicesRepositories) {}

  async execute(command: AddDeviceUserCommand): Promise<DeviceInfoType> {
    const fixDate = new Date();
    const device = await this.addDevice(
      command.deviceName,
      command.ip,
      command.userId,
      fixDate,
    );
    return {
      userId: command.userId,
      deviceId: device.deviceId,
      date: device.date,
    };
  }

  private async addDevice(
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

    return this.authDevicesRepositories.saveDevice(device);
  }
}

type DeviceInfoType = {
  userId: ObjectId;
  deviceId: string;
  date: Date;
};
