import mongoose from 'mongoose';
import { IsUrl, Length } from 'class-validator';

export type QueryForPaginationType = {
  SearchNameTerm: string;
  PageNumber: number;
  PageSize: number;
};

export class BodyForCreateBloggerType {
  @Length(1, 15)
  name: string;
  @Length(1, 100)
  @IsUrl()
  youtubeUrl: string;
}

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
