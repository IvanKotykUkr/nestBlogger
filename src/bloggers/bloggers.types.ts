import { IsUrl, Length } from 'class-validator';
import { ObjectId } from 'mongodb';

export type QueryForPaginationType = {
  SearchNameTerm: string;
  PageNumber: number;
  PageSize: number;
};

export class BodyForCreateBloggerType {
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
};

export type BloggerType = {
  id?: ObjectId;
  _id?: ObjectId;
  name: string;
  youtubeUrl: string;
};
export type BloggerResponseType = {
  id: ObjectId;
  name: string;
  youtubeUrl: string;
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
