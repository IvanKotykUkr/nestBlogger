export class QueryForGetUsers {
  banStatus: string;
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: number;
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
