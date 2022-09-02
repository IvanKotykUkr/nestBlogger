import { PaginationType } from './bloggers,types';
import mongoose, { ObjectId } from 'mongoose';

export type BodyTypeForPost = {
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: mongoose.Types.ObjectId;
};
export type PostsDBType = {
  _id: mongoose.Types.ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: mongoose.Types.ObjectId;
  bloggerName: string;
  addedAt: Date;
};
export type PostUpdatedType = {
  _id: mongoose.Types.ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: mongoose.Types.ObjectId;
  bloggerName: string;
};
export type PostsResponseType = {
  id?: ObjectId | mongoose.Types.ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: ObjectId | mongoose.Types.ObjectId;
  bloggerName: string;
  addedAt: Date;
  /* extendedLikesInfo: {
     likesCount: number;
     dislikesCount: number;
     myStatus: string;
     newestLikes: Array<{
       addedAt?: Date;
       userId?: ObjectId;
       login?: string;
     }>;
   };
   
   */
};
export type CheckBloggerType = {
  _id: mongoose.Types.ObjectId;
  name: string;
};
export type PostsResponseTypeWithPagination = PaginationType<PostsResponseType>;
