import { IsEmail, IsJWT, IsString, IsUUID, Length } from 'class-validator';
import { ObjectId } from 'mongodb';

export class AuthBodyType {
  @IsString()
  @Length(3, 10)
  login: string;
  @Length(6, 20)
  @IsString()
  password: string;
}

export class refreshType {
  @IsJWT()
  refreshToken: string;
}

export class ConfirmationType {
  @IsUUID()
  code: string;
}

export class ResendConfirmationType {
  @IsEmail()
  email: string;
}

export type TokensType = {
  _id: ObjectId;
  token: string;
  addedAt: number;
};

export type RecordType = {
  _id: ObjectId;
  ip: string;
  date: Date;
  process: string;
};
