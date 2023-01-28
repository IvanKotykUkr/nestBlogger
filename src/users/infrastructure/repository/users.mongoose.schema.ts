import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false, _id: false })
export class AccountData extends Document {
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
export class EmailConfirmation extends Document {
  @Prop()
  confirmationCode: string;
  @Prop()
  expirationDate: Date;
  @Prop({ required: true })
  public isConfirmed: boolean;
}

//export const EmailConfirmationSchema =
//  SchemaFactory.createForClass(EmailConfirmation);

@Schema({ versionKey: false })
export class PasswordRecovery extends Document {
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

//export const PasswordRecoverySchema =
//SchemaFactory.createForClass(PasswordRecovery);

@Schema({ versionKey: false })
export class User extends Document {
  @Prop()
  _id: ObjectId;
  @Prop({ type: AccountData })
  accountData: AccountData;
  @Prop({ type: EmailConfirmation })
  emailConfirmation: EmailConfirmation;
  @Prop({ type: PasswordRecovery })
  passwordRecovery: PasswordRecovery;
  @Prop()
  createdAt: Date;

  checkConfirmed: (...args: any) => any;

  checkExpirationCode: (...args: any) => any;

  confirm: (...args: any) => any;
  comparePassword: (passwordHash: string) => ObjectId;
}

export const UsersSchema = SchemaFactory.createForClass(User);

UsersSchema.methods.checkConfirmed = async function () {
  if (this.emailConfirmation.isConfirmed === true) {
    throw new BadRequestException([
      { message: 'code already confirmed', field: 'code' },
    ]);
  }
};

UsersSchema.methods.checkExpirationCode = async function () {
  if (this.emailConfirmation.expirationDate < new Date()) {
    throw new BadRequestException([{ message: 'code expired', field: 'code' }]);
  }
};

UsersSchema.methods.confirm = async function () {
  this.emailConfirmation.isConfirmed = true;
};
UsersSchema.methods.comparePassword = async function (passwordHash: string) {
  if (passwordHash !== this.accountData.passwordHash) {
    throw new UnauthorizedException([
      {
        message: 'WRONG PASSWORD',
        field: 'password',
      },
    ]);
  }
  return;
};
