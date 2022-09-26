import { IsJWT } from 'class-validator';

export type AuthBodyType = {
  login: string;
  password: string;
};

export class refreshType {
  @IsJWT()
  refreshToken: string;
}
