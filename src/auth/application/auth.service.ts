import { Injectable } from '@nestjs/common';
import { UsersHelper } from '../../users/application/users.helper';
import { ObjectId } from 'mongodb';
import { UsersRepositories } from '../../users/infrastructure/users.repositories';
import { EmailManager } from './adapters/email.manager';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import { IdValidation, newPasswordDTO } from '../../users/users.types';
import { validate } from 'class-validator';

@Injectable()
export class AuthService {
  constructor(
    protected userHelper: UsersHelper,
    protected usersRepositories: UsersRepositories,
    protected emailManager: EmailManager,
  ) {}

  async checkUser(login: string, password: string): Promise<ObjectId | string> {
    const user = await this.usersRepositories.findUserByEmailOrLogin(login);
    if (typeof user === 'string') return user;
    const passwordHash = await this.userHelper.generateHash(
      password,
      user.accountData.passwordSalt,
    );
    if (user.accountData.passwordHash !== passwordHash) {
      return 'password wrong';
    }
    return user._id;
  }

  async createUser(login: string, email: string, password: string) {
    const user = await this.userHelper.makeUser(login, email, password);
    await this.usersRepositories.createUser(user);
    try {
      await this.emailManager.sendEmailConfirmationMessage(
        user.accountData.email,
        user.emailConfirmation.confirmationCode,
      );
    } catch (error) {
      console.error(error);

      await this.usersRepositories.deleteUser(user._id);
    }
    return;
  }

  async confirmUser(code: string): Promise<string | boolean> {
    return this.usersRepositories.confirmUser(code);
  }

  async resendConfirmationCode(email: string) {
    const user = await this.usersRepositories.findUserByEmailOrLogin(email);
    if (typeof user === 'string') {
      return user;
    }
    if (user.emailConfirmation.isConfirmed === true) return 'already confirmed';

    const confirmationCode = uuidv4();
    const expirationDate = add(new Date(), {
      hours: 1,
      minutes: 2,
    });
    const code = await this.usersRepositories.renewConfirmationCode(
      email,
      confirmationCode,
      expirationDate,
    );

    try {
      await this.emailManager.resentEmailConfirmationMessage(
        email,
        confirmationCode,
      );
      return 'allOk';
    } catch (error) {
      console.error(error);

      return true;
    }
  }

  async recoveryPassword(email: string, ip: string, date: Date) {
    const user = await this.usersRepositories.findByEmail(email);
    if (!user) return;
    await this.userHelper.makeRecoveryCode(user, ip, date);
    await this.usersRepositories.saveUser(user);
    await this.emailManager.sendPasswordRecoveryCode(
      email,
      user.passwordRecovery.recoveryCode,
    );
    return;
  }

  async newPassword(newPasswordDTO: newPasswordDTO): Promise<string> {
    const userId = await this.userHelper.takeUserIdFromRecoveryCode(
      newPasswordDTO.recoveryCode,
    );

    const checkId = await this.validateId(userId);
    if (typeof checkId === 'string') return checkId;
    const user = await this.usersRepositories.findById(new ObjectId(userId));
    if (newPasswordDTO.recoveryCode !== user.passwordRecovery.recoveryCode) {
      return 'incorrect';
    }
    if (user.passwordRecovery.isRecovered === true) return 'it was changed';
    const newHash = await this.userHelper.generateHash(
      newPasswordDTO.newPassword,
      user.accountData.passwordSalt,
    );
    user.accountData.passwordHash = newHash;
    user.passwordRecovery.isRecovered = true;
    await this.usersRepositories.saveUser(user);
    return 'all ok';
  }

  private async validateId(userId: string) {
    const id = new IdValidation();
    id.userId = userId;
    return validate(id).then((errors) => {
      if (errors.length > 0) {
        return 'incorrect';
      } else {
        return;
      }
    });
  }
}
