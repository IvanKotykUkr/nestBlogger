import { PaginationType } from './bloggers,types';
import mongoose, { ObjectId } from 'mongoose';
import { IsMongoId, Length } from 'class-validator';

export class IdTypeForReq {
  @IsMongoId()
  id: mongoose.Types.ObjectId;
}

export class BodyTypeForPost {
  @Length(1, 30)
  title: string;
  @Length(1, 100)
  shortDescription: string;
  @Length(1, 1000)
  content: string;
  @IsMongoId()
  bloggerId: mongoose.Types.ObjectId;
}

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
