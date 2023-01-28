import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersHelper {
  async generateHash(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async takeUserIdFromRecoveryCode(recoveryCode: string) {
    return this.decodeRecoveryCode(recoveryCode);
  }

  private async decodeRecoveryCode(code: string) {
    return Buffer.from(code, 'base64').toString('binary');
  }
}
