import { IsEmail, IsJWT, IsString, IsUUID, Length } from "class-validator";
import { ObjectId } from "mongodb";

export class AuthBodyType {
  @IsString()
  loginOrEmail: string;
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

export class EmailBodyType {
  @IsEmail()
  email: string;
}

export class BodyForNewPasswordDTO {
  @Length(6, 20)
  @IsString()
  newPassword: string;
  @IsString()
  recoveryCode: string;
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
