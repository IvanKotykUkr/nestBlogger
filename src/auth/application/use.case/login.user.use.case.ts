import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersRepositories } from "../../../users/infrastructure/users.repositories";
import { UnauthorizedException } from "@nestjs/common";
import { AuthDevicesRepositories } from "../../../securitydevices/infrastructure/auth.devices.repositories";
import { UsersHelper } from "../../../users/application/users.helper";
import { ObjectId } from "mongodb";
import {
  AuthDevicesTypeDTO,
  DevicesInfo,
} from "../../../securitydevices/infrastructure/device.types";
import * as uuid from "uuid";

export class LoginUserCommand {
  constructor(
    public login: string,
    public password: string,
    public deviceName: string,
    public ip: string
  ) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand> {
  return;

  constructor(
    protected usersRepositories: UsersRepositories,
    protected authDevicesRepositories: AuthDevicesRepositories,
    protected userHelper: UsersHelper
  ) {}

  async execute(command: LoginUserCommand): Promise<DeviceInfoType> {
    const user = await this.usersRepositories.findUserByEmailOrLogin(
      command.login
    );
    if (typeof user === "string") {
      throw new UnauthorizedException([
        {
          message: "WRONG LOGIN",
          field: "login",
        },
      ]);
    }
    const passwordHash = await this.userHelper.generateHash(
      command.password,
      user.accountData.passwordSalt
    );
    await user.comparePassword(passwordHash);
    const fixDate = new Date();
    const device = await this.addDevice(
      command.deviceName,
      command.ip,
      user._id,
      fixDate
    );
    return { userId: user._id, deviceId: device.deviceId, date: device.date };
  }

  private async addDevice(
    deviceName: string,
    ip: string,
    userId: ObjectId,
    date: Date
  ): Promise<DevicesInfo> {
    const usedDevice: string | DevicesInfo =
      await this.authDevicesRepositories.checkDeviceForUser(
        deviceName,
        userId,
        date
      );
    if (typeof usedDevice === "string") {
      return this.addNewDevice(deviceName, ip, userId, date);
    }

    return usedDevice;
  }

  private makeDeviceDTO(
    device: string,
    ip: string,
    userId: ObjectId,
    date: Date
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
    date: Date
  ): Promise<DevicesInfo> {
    const device: AuthDevicesTypeDTO = this.makeDeviceDTO(
      deviceName,
      ip,
      userId,
      date
    );

    return this.authDevicesRepositories.saveDevice(device);
  }
}

type DeviceInfoType = {
  userId: ObjectId;
  deviceId: string;
  date: Date;
};
