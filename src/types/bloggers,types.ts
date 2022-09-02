import mongoose from 'mongoose';

export type QueryForPaginationType = {
  SearchNameTerm: string;
  PageNumber: number;
  PageSize: number;
};
export type BodyForCreateBloggerType = {
  name: string;
  youtubeUrl: string;
};
export type BloggerDBType = {
  _id: mongoose.Types.ObjectId;
  name: string;
  youtubeUrl: string;
};

export type BloggerType = {
  id?: mongoose.Types.ObjectId;
  _id?: mongoose.Types.ObjectId;
  name: string;
  youtubeUrl: string;
};
export type BloggerResponseType = {
  id: mongoose.Types.ObjectId;
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
