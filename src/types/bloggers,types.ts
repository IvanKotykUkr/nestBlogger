import { ObjectId } from 'mongoose';

export type QueryForGetBloggersType = {
  SearchNameTerm: string;
  PageNumber: number;
  PageSize: number;
};
export type BodyForCreateBloggerType = {
  name: string;
  youtubeUrl: string;
};
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
