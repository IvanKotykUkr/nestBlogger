import { ObjectId } from "mongodb";
import { UserRequestType } from "../../../../users/users.types";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "../jwt.service";
import { Response } from "express";
import { UsersRepositories } from "../../../../users/infrastructure/users.repositories";
import { AuthDevicesRepositories } from "../../../../securitydevices/infrastructure/auth.devices.repositories";
import { DevicesInfo } from "../../../../securitydevices/infrastructure/device.types";

@Injectable()
export class GuardHelper {
  constructor(
    protected usersRepositories: UsersRepositories,
    protected jwtService: JwtService,
    protected authDevicesRepositories: AuthDevicesRepositories
  ) {}

  async findUserById(userId: ObjectId): Promise<UserRequestType> {
    const user = await this.usersRepositories.findUserById(userId);
    if (typeof user == "string") {
      throw new UnauthorizedException([
        { message: "there is no user", field: "token" },
      ]);
    }
    return user;
  }

  public checkCookie(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException([
        { message: "Not have refresh token in cookies", field: "cookie" },
      ]);
    }
    return refreshToken;
  }

  getUserMetaRefreshToken(refreshToken: string, res: Response) {
    const metaFromRefreshToken =
      this.jwtService.getMetaFromRefreshToken(refreshToken);
    if (typeof metaFromRefreshToken === "string") {
      res.clearCookie("refreshToken");
      throw new UnauthorizedException([
        { message: "expired", field: "refreshToken" },
      ]);
    }
    return metaFromRefreshToken;
  }

  async checkValidRefreshToken(
    iat: number,
    deviceId: string,
    res: Response
  ): Promise<DevicesInfo> {
    const date: Date = new Date();
    const device = await this.authDevicesRepositories.checkToken(
      iat,
      deviceId,
      date
    );
    if (typeof device === "string") {
      res.clearCookie("refreshToken");
      throw new UnauthorizedException([
        { message: "invalid refreshToken", field: "refreshToken" },
      ]);
    }
    return device;
  }

  async logoutUser(userId: ObjectId, deviceId: string) {
    return this.authDevicesRepositories.logoutDevice(userId, deviceId);
  }
}
