import { Injectable } from "@nestjs/common";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserFromTokenType } from "../../../users/users.types";
import { ObjectId } from "mongodb";

export const wrong = "wrong";

@Injectable()
export class JwtService {
  async createAccessToken(id: ObjectId): Promise<{ accessToken: string }> {
    const access: string = jwt.sign(
      { userId: id },
      process.env.ACCESS_JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { accessToken: access };
  }

  async createRefreshToken(
    id: ObjectId,
    deviceId: string,
    data: Date
  ): Promise<string> {
    const refresh: string = jwt.sign(
      { userId: id, iat: +data, deviceId },
      process.env.REFRESH_JWT_SECRET,
      { expiresIn: "2h" }
    );

    return refresh;
  }

  getUserIdByAccessToken(token: string): UserFromTokenType | string {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return jwt.verify(token, process.env.ACCESS_JWT_SECRET);
    } catch (error) {
      return wrong;
    }
  }

  getMetaFromRefreshToken(token: string): JwtPayload | string {
    try {
      return jwt.verify(token, process.env.REFRESH_JWT_SECRET);
    } catch (error) {
      return wrong;
    }
  }
}
