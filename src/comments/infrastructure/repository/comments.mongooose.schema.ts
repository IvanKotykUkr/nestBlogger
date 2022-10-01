import mongoose, { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { CommentsDBType } from '../../comments.types';

export const CommentsSchema = new mongoose.Schema<CommentsDBType>(
  {
    _id: ObjectId,
    postId: ObjectId,
    content: String,
    userId: ObjectId,
    userLogin: String,
    addedAt: Date,
  },
  {
    versionKey: false,
  },
);

export type CommentsDocument = CommentsDBType & Document;
//export const BloggerModel = model<BloggerDocument>('Bloggers', MongooseAppSchema);
//export const BloggerModel = mongoose.model('Bloggers', MongooseAppSchema);
