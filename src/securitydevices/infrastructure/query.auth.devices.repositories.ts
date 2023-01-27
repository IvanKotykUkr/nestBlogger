import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DevicesDocument } from "./repository/auth.devices.sessions.mongoose";
import { Model } from "mongoose";
import { AuthDevicesResponseType } from "./device.types";
import { ObjectId } from "mongodb";

@Injectable()
export class QueryAuthDevicesRepositories {
  constructor(
    @InjectModel("auth devices")
    private AuthDevisesModel: Model<DevicesDocument>
  ) {}

  async getAllDeviceByUserId(
    userId: ObjectId
  ): Promise<AuthDevicesResponseType[]> {
    const devices = await this.AuthDevisesModel.find({ userId });
    return devices.map((d) => ({
      ip: d.ip,
      title: d.title,
      lastActiveDate: d.lastActiveDate,
      deviceId: d.deviceId,
    }));
  }
}
