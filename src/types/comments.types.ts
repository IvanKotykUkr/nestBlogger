import { ObjectId } from 'mongodb';
import { Length } from 'class-validator';
import { PaginationType } from './bloggers.types';

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
  addedAt: Date;
};
export type CommentResponseType = {
  id: ObjectId;
  content: string;
  userId: ObjectId;
  userLogin: string;
  addedAt: Date;
};
export type CommentsResponseTypeWithPagination =
  PaginationType<CommentResponseType>;
