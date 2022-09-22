import { Injectable } from '@nestjs/common';
import { UserDBType } from '../types/users.types';
import { ObjectId } from 'mongodb';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';

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
    };
    return newUser;
  }

  async generateHash(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
