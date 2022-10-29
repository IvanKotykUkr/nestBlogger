import { IsEmail, IsJWT, IsString, IsUUID, Length } from 'class-validator';

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
