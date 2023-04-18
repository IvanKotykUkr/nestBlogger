import { IsUrl, Length } from 'class-validator';
import { ObjectId } from 'mongodb';

export type QueryForPaginationType = {
  searchNameTerm: string;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: string;
};
export type createBloggerType = {
  name: string;

  description: string;

  websiteUrl: string;
};

export class BodyForCreateBloggerType {
  @Length(4, 15)
  name: string;
  @Length(1, 500)
  description: string;
  @Length(1, 100)
  @IsUrl()
  websiteUrl: string;
}

export class BodyForUpdateBloggerType {
  @Length(4, 15)
  name: string;
  @Length(1, 500)
  description: string;
  @Length(1, 100)
  @IsUrl()
  websiteUrl: string;
}

export type BloggerDBType = {
  _id: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  ownerId: ObjectId;
  createdAt: Date;
  isMembership: boolean;
};

export type BloggerType = {
  id?: ObjectId;
  _id?: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  ownerId: ObjectId;
  createdAt: Date;
  isMembership: boolean;
};
export type BloggerTypeForUpdate = {
  id?: ObjectId;
  _id?: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
};
export type BloggerResponseType = {
  id: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;
};
export type PaginationType<T> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
};

export type BloggSearchFilerType =
  | { $and: ({ ownerId: ObjectId } | { name: { $regex: string } })[] }
  | {
      ownerId: ObjectId;
    };

export type BloggerResponseTypeWithPagination =
  PaginationType<BloggerResponseType>;
