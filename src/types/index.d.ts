import { UserRequestType } from '../users/users.types';
import { DevicesRequestType } from '../securitydevices/infrastructure/device.types';
import { ObjectId } from 'mongodb';

declare global {
  declare namespace Express {
    export interface Request {
      user: UserRequestType | userId | null;
      device: DevicesRequestType | null;
      userId: ObjectId;
    }
  }
}
