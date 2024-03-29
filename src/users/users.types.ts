import { ObjectId } from 'mongodb';
import { PaginationType } from '../bloggers/bloggers.types';
import { IsEmail, IsMongoId, Length, Matches } from 'class-validator';

export class BodyForCreateUser {
  @Length(3, 10)
  @Matches(/[a-zA-Z0-9_-]/, { message: 'Should be not Empty' })
  login: string;
  @IsEmail()
  email: string;
  @Length(6, 20)
  @Matches(/[a-zA-Z0-9_-]/, { message: 'Should be not Empty' })
  password: string;
}

export type UserDBType = {
  _id: ObjectId;
  accountData: {
    login: string;
    email: string;
    passwordHash: string;
    passwordSalt: string;
    createdAt?: Date;
  };
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
  };
  passwordRecovery?: {
    recoveryCode: string;
    expirationCode: Date;
    ip: string;
    recoveryDate: Date;
    isRecovered: boolean;
  };
  banInfo: {
    isBanned: boolean;
    banDate?: Date;
    banReason?: string;
  };
  createdAt: Date;
};
type passwordRecovery = {
  recoveryCode: string;
  expirationCode: Date;
  ip: string;
  recoveryDate: Date;
};
export type AccountDataType = {
  login: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt?: Date;
};
export type EmailConfirmationType = {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
};

export type UsersResponseType = {
  id: ObjectId;
  login: string;
  email: string;
  banInfo: {
    isBanned: boolean;
    banReason?: string;
    banDate?: Date;
  };
  createdAt: Date;
};
export type CreateUserResponseType = {
  id: ObjectId;
  login: string;
  email: string;
  createdAt: Date;
  banInfo: {
    isBanned: boolean;
    banDate?: Date;
    banReason?: string;
  };
};
export type UsersWithPaginationResponseType = PaginationType<UsersResponseType>;
export type UserFromTokenType = {
  userId: ObjectId;
  iat: number;
  exp: number;
};
export type UserRequestType = {
  id?: ObjectId;
  login: string;
  email?: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt?: Date;
  deviceId?: string;
  date?: Date;
};

export class newPasswordDTO {
  newPassword: string;

  recoveryCode: string;
}

export class IdValidation {
  @IsMongoId()
  userId: string;
}
