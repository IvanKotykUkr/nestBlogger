import { IsUrl, Length } from 'class-validator';
import { ObjectId } from 'mongodb';

export class QueryForPaginationType {
  SearchNameTerm: string;
  PageNumber: number;
  PageSize: number;
  SortBy: string;
  SortDirection: string;
}

export class BodyForCreateBloggerType {
  @Length(4, 15)
  name: string;
  @Length(1, 100)
  @IsUrl()
  youtubeUrl: string;
}

export class BodyForUpdateBloggerType {
  @Length(4, 15)
  name: string;
  @Length(1, 100)
  @IsUrl()
  youtubeUrl: string;
}

export type BloggerDBType = {
  _id: ObjectId;
  name: string;
  youtubeUrl: string;
  createdAt: Date;
};

export type BloggerType = {
  id?: ObjectId;
  _id?: ObjectId;
  name: string;
  youtubeUrl: string;
  createdAt: Date;
};
export type BloggerTypeForUpdate = {
  id?: ObjectId;
  _id?: ObjectId;
  name: string;
  youtubeUrl: string;
  createdAt: Date;
};
export type BloggerResponseType = {
  id: ObjectId;
  name: string;
  youtubeUrl: string;
  createdAt: Date;
};
export type PaginationType<T> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
};

export type BloggerResponseTypeWithPagination =
  PaginationType<BloggerResponseType>;
