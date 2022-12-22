import { UserRequestType } from '../users/users.types';
import { DevicesRequestType } from '../securitydevices/infrastructure/device.types';

declare global {
  declare namespace Express {
    export interface Request {
      user: UserRequestType | null;
      device: DevicesRequestType | null;
    }
  }
}
