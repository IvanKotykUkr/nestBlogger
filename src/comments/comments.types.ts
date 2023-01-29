import { ObjectId } from 'mongodb';
import { Length } from 'class-validator';
import { PaginationType } from '../bloggers/bloggers.types';

export class BodyForComments {
  @Length(20, 300)
  content: string;
}

export type CommentsDBType = {
  _id: ObjectId;
  postId: ObjectId;
  content: string;
  userId: ObjectId;
  userLogin: string;
  createdAt: Date;
};
export type CommentResponseType = {
  id: ObjectId;
  content: string;
  userId: ObjectId;
  userLogin: string;
  createdAt: Date;
};
export type CommentWithLikeResponseType = {
  id: ObjectId;
  content: string;
  userId: ObjectId;
  userLogin: string;
  createdAt: Date;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };
};
export type CommentsResponseTypeWithPagination =
  PaginationType<CommentWithLikeResponseType>;
export type LikeDbType = {
  _id: ObjectId;
  entityId: ObjectId;
  status: string;
  addedAt: Date;
  userId: ObjectId;
  login: string;
};
export type ArrayIdType = Array<{
  entityId: ObjectId | string;
}>;
export type LikeOrDislikeIdType = Array<{
  entityId: ObjectId;
}>;
export type ArrayCountIdType = Array<{
  entityId: ObjectId;
  count: number;
}>;
export type ArrayLikesType = Array<{
  entityId: ObjectId;
  addedAt: Date;
  userId: ObjectId;
  login: string;
}>;
export type StatusLikeOrDislikeType = Array<{
  entityId: ObjectId;
  status: string;
}>;
export type NewestThreeLikes = {
  addedAt?: Date;
  userId?: ObjectId;
  login?: string;
};
