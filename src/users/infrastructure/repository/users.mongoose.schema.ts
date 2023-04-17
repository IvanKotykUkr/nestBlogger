import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false, _id: false })
export class AccountData {
  @Prop()
  login: string;
  @Prop()
  email: string;
  @Prop()
  passwordHash: string;
  @Prop()
  passwordSalt: string;
  @Prop()
  createdAt: Date;
}

//export const AccountDataSchema = SchemaFactory.createForClass(AccountData);

@Schema({ versionKey: false, _id: false })
export class EmailConfirmation {
  @Prop()
  confirmationCode: string;
  @Prop()
  expirationDate: Date;
  @Prop({ required: true })
  public isConfirmed: boolean;
}

//export const EmailConfirmationSchema =
//  SchemaFactory.createForClass(EmailConfirmation);

@Schema({ versionKey: false, _id: false })
export class PasswordRecovery {
  @Prop()
  recoveryCode: string;
  @Prop()
  expirationCode: Date;
  @Prop()
  ip: string;
  @Prop()
  recoveryDate: Date;
  @Prop()
  isRecovered: boolean;
}

@Schema({ versionKey: false, _id: false })
export class BanInfo {
  @Prop()
  isBanned: boolean;
  @Prop()
  banDate: Date;
  @Prop()
  banReason: string;
}

@Schema({ versionKey: false })
export class User {
  @Prop({ type: ObjectId })
  _id: ObjectId;
  @Prop()
  accountData: AccountData;
  @Prop()
  emailConfirmation: EmailConfirmation;
  @Prop()
  passwordRecovery: PasswordRecovery;
  @Prop()
  banInfo: BanInfo;
  @Prop()
  createdAt: Date;

  checkConfirmed() {
    if (this.emailConfirmation.isConfirmed === true) {
      throw new BadRequestException([
        { message: 'code already confirmed', field: 'code' },
      ]);
    }
    return true;
  }

  checkExpirationCode() {
    if (this.emailConfirmation.expirationDate < new Date()) {
      throw new BadRequestException([
        { message: 'code expired', field: 'code' },
      ]);
    }
    return true;
  }

  confirm() {
    this.emailConfirmation.isConfirmed = true;
    return;
  }

  comparePassword(passwordHash: string) {
    if (passwordHash !== this.accountData.passwordHash) {
      throw new UnauthorizedException([
        {
          message: 'WRONG PASSWORD',
          field: 'password',
        },
      ]);
    }
    return true;
  }

  checkPasswordRecoveryStatus() {
    if (this.passwordRecovery.expirationCode < new Date()) {
      throw new BadRequestException([
        { message: 'code expired', field: 'code' },
      ]);
    }
    return true;
  }

  checkExpirationPasswordRecoveryCode() {
    if (this.passwordRecovery.isRecovered === true) {
      throw new BadRequestException([
        { message: 'code already confirmed', field: 'code' },
      ]);
    }
    return true;
  }
}

export const UsersSchema = SchemaFactory.createForClass(User);
UsersSchema.methods = {
  checkConfirmed: User.prototype.checkConfirmed,
  checkExpirationCode: User.prototype.checkExpirationCode,
  confirm: User.prototype.confirm,
  comparePassword: User.prototype.comparePassword,
  checkPasswordRecoveryStatus: User.prototype.checkPasswordRecoveryStatus,
  checkExpirationPasswordRecoveryCode:
    User.prototype.checkExpirationPasswordRecoveryCode,
};
