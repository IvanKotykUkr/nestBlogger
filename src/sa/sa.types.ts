import { IsBoolean, IsMongoId, IsNotEmpty, Length } from 'class-validator';
import { ObjectId } from 'mongodb';

export class QueryForGetUsers {
  banStatus: string;
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: number;
}

export class BodyForBanUser {
  @IsNotEmpty()
  @IsBoolean()
  isBanned: boolean;
  @Length(0, 20)
  banReason: string;
}

export class IdTypeForReqUser {
  @IsMongoId()
  id: ObjectId;
  @IsMongoId()
  userId: ObjectId;
}

export type UsersSearchCountParams =
  | {}
  | { 'accountData.login': { $regex: string } }
  | {
      'accountData.email': { $regex: string };
    }
  | { 'banInfo.isBanned': boolean }
  | {
      $and: (
        | { 'banInfo.isBanned': boolean }
        | { 'accountData.login': { $regex: string } }
        | {
            'accountData.email': { $regex: string };
          }
      )[];
    };
