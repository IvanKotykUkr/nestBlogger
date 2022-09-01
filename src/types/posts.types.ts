import { ObjectId } from 'mongoose';

export type PostsDBType = {
  _id: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: ObjectId;
  bloggerName: string;
  addedAt: Date;
};
