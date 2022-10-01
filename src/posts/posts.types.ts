import { PaginationType } from '../bloggers/bloggers.types';
import { IsMongoId, Length } from 'class-validator';
import { ObjectId } from 'mongodb';

export class IdTypeForReq {
  @IsMongoId()
  id: ObjectId;
}

export class BodyTypeForPostBlogger {
  @Length(1, 30)
  title: string;
  @Length(1, 100)
  shortDescription: string;
  @Length(1, 1000)
  content: string;
}

export class BodyTypeForPost {
  @Length(1, 30)
  title: string;
  @Length(1, 100)
  shortDescription: string;
  @Length(1, 1000)
  content: string;
  @IsMongoId()
  bloggerId: ObjectId;
}

export type PostsDBType = {
  _id: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: ObjectId;
  bloggerName: string;
  addedAt: Date;
};
export type PostUpdatedType = {
  _id: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: ObjectId;
  bloggerName: string;
};
export type PostsResponseType = {
  id?: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: ObjectId;
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
  _id: ObjectId;
  name: string;
};
export type PostsResponseTypeWithPagination = PaginationType<PostsResponseType>;
