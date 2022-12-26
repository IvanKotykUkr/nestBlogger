import { Injectable } from '@nestjs/common';
import { UserDBType } from '../users.types';
import { ObjectId } from 'mongodb';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import { UsersDocument } from '../infrastructure/repository/users.mongoose.schema';

@Injectable()
export class UsersHelper {
  async makeUser(
    login: string,
    email: string,
    password: string,
  ): Promise<UserDBType> {
    const passwordSalt: string = await bcrypt.genSalt(10);
    const passwordHash: string = await this.generateHash(
      password,
      passwordSalt,
    );

    const newUser: UserDBType = {
      _id: new ObjectId(),
      accountData: {
        login,
        email,
        passwordHash,
        passwordSalt,
        createdAt: new Date(),
      },
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 2,
        }),
        isConfirmed: false,
      },
      createdAt: new Date(),
    };
    return newUser;
  }

  async generateHash(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async makeRecoveryCode(
    user: UsersDocument,
    ip: string,
    date: Date,
  ): Promise<UsersDocument> {
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
    const code = Buffer.from(userId.toString(), 'binary').toString('base64');
    return code;
  }

  private async decodeRecoveryCode(code: string) {
    return Buffer.from(code, 'base64').toString('binary');
  }
}
