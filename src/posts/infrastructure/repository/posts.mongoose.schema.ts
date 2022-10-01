import mongoose, { Document } from 'mongoose';
import { PostsDBType } from '../../posts.types';
import { ObjectId } from 'mongodb';

export const PostsSchema = new mongoose.Schema<PostsDBType>(
  {
    _id: ObjectId,
    title: String,
    shortDescription: String,
    content: String,
    bloggerId: ObjectId,
    bloggerName: String,
    addedAt: Date,
  },
  {
    versionKey: false,
  },
);
export type PostsDocument = PostsDBType & Document;
