import { IsEmail, IsJWT, IsUUID } from 'class-validator';

export type AuthBodyType = {
  login: string;
  password: string;
};

export class refreshType {
  @IsJWT()
  refreshToken: string;
}

export class ConfirmationType {
  @IsUUID()
  code: string;
  @IsEmail()
  email: string;
}

export class ResendConfirmationType {
  @IsEmail()
  email: string;
}
