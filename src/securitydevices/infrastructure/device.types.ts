import { ObjectId } from "mongodb";

export type AuthDevicesType = {
  _id: ObjectId;
  ip: string;
  title: string;
  lastActiveDate: Date;
  deviceId: string;
  userId: ObjectId;
};
export type AuthDevicesResponseType = {
  ip: string;
  title: string;
  lastActiveDate: Date;
  deviceId: string;
};
export type AuthDevicesTypeDTO = {
  _id: ObjectId;
  ip: string;
  title: string;
  lastActiveDate: Date;
  deviceId: string;
  userId: ObjectId;
};
export type DevicesInfo = {
  deviceId: string;
  date: Date;
};
export type DevicesRequestType = {
  userId: ObjectId;
  deviceId: string;
  date: Date;
};

export class IdForReqDevices {
  // @IsUUID()
  ///
  id: string;
}
