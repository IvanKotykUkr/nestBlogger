import { Injectable } from "@nestjs/common";
import { AuthDevicesRepositories } from "../infrastructure/auth.devices.repositories";
import { ObjectId } from "mongodb";

@Injectable()
export class SecurityDevicesService {
  constructor(protected authDevicesRepositories: AuthDevicesRepositories) {}

  async terminateAllSessionExceptCurrent(userId: ObjectId, deviceId: string) {
    return this.authDevicesRepositories.terminateAllSessionExceptCurrent(
      userId,
      deviceId
    );
  }

  async deleteDevice(userId: ObjectId, deviceId: string): Promise<string> {
    return this.authDevicesRepositories.deleteDevice(userId, deviceId);
  }
}
