import { Injectable } from "@nestjs/common";
import { UsersHelper } from "../../users/application/users.helper";
import { ObjectId } from "mongodb";
import { UsersRepositories } from "../../users/infrastructure/users.repositories";
import { EmailManager } from "./adapters/email.manager";
import { IdValidation, newPasswordDTO } from "../../users/users.types";
import { validate } from "class-validator";

@Injectable()
export class AuthService {
  constructor(
    protected userHelper: UsersHelper,
    protected usersRepositories: UsersRepositories,
    protected emailManager: EmailManager
  ) {}

  async recoveryPassword(email: string, ip: string, date: Date) {
    const user = await this.usersRepositories.findByEmail(email);
    if (!user) return;
    await this.userHelper.makeRecoveryCode(user, ip, date);
    await this.usersRepositories.saveUser(user);
    await this.emailManager.sendPasswordRecoveryCode(
      email,
      user.passwordRecovery.recoveryCode
    );
    return;
  }

  async newPassword(newPasswordDTO: newPasswordDTO): Promise<string> {
    const userId = await this.userHelper.takeUserIdFromRecoveryCode(
      newPasswordDTO.recoveryCode
    );

    const checkId = await this.validateId(userId);
    if (typeof checkId === "string") return checkId;
    const user = await this.usersRepositories.findById(new ObjectId(userId));
    if (newPasswordDTO.recoveryCode !== user.passwordRecovery.recoveryCode) {
      return "incorrect";
    }
    if (user.passwordRecovery.isRecovered === true) return "it was changed";
    const newHash = await this.userHelper.generateHash(
      newPasswordDTO.newPassword,
      user.accountData.passwordSalt
    );
    user.accountData.passwordHash = newHash;
    user.passwordRecovery.isRecovered = true;
    await this.usersRepositories.saveUser(user);
    return "all ok";
  }

  private async validateId(userId: string) {
    const id = new IdValidation();
    id.userId = userId;
    return validate(id).then((errors) => {
      if (errors.length > 0) {
        return "incorrect";
      } else {
        return;
      }
    });
  }
}
