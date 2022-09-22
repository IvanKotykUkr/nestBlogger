import { UserRequestType } from './users.types';

declare global {
  declare namespace Express {
    export interface Request {
      user: UserRequestType | null;
    }
  }
}
