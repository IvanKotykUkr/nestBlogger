import { Injectable } from "@nestjs/common";
import { ObjectId } from "mongodb";
import * as bcrypt from "bcrypt";
import add from "date-fns/add";
import { UserDocument } from "../infrastructure/repository/users.mongoose.schema";

@Injectable()
export class UsersHelper {
  async generateHash(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async makeRecoveryCode(
    user: UserDocument,
    ip: string,
    date: Date
  ): Promise<UserDocument> {
    const code = await this.encodeRecoveryCode(user._id);
    user.passwordRecovery.recoveryCode = code;
    user.passwordRecovery.recoveryDate = date;
    user.passwordRecovery.ip = ip;
    user.passwordRecovery.expirationCode = add(new Date(), {
      hours: 1,
      minutes: 2,
    });
    user.passwordRecovery.isRecovered = false;
    return user;
  }

  async takeUserIdFromRecoveryCode(recoveryCode: string) {
    return this.decodeRecoveryCode(recoveryCode);
  }

  private async encodeRecoveryCode(userId: ObjectId) {
    const code = Buffer.from(userId.toString(), "binary").toString("base64");
    return code;
  }

  private async decodeRecoveryCode(code: string) {
    return Buffer.from(code, "base64").toString("binary");
  }
}
