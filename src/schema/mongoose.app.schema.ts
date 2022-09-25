import mongoose, { Document } from 'mongoose';

import { BloggerDBType } from '../types/bloggers.types';
import { PostsDBType } from '../types/posts.types';
import { ObjectId } from 'mongodb';
import { UserDBType } from '../types/users.types';
import { CommentsDBType } from '../types/comments.types';

export const BloggerSchema = new mongoose.Schema<BloggerDBType>(
  {
    _id: ObjectId,
    name: { type: String, required: true },
    youtubeUrl: { type: String, required: true },
  },
  {
    versionKey: false,
  },
);
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
export const UsersSchema = new mongoose.Schema<UserDBType>(
  {
    _id: ObjectId,
    accountData: {
      login: String,
      email: String,
      passwordHash: String,
      passwordSalt: String,
      createdAt: Date,
    },
    emailConfirmation: {
      confirmationCode: String,
      expirationDate: Date,
      isConfirmed: Boolean,
    },
  },
  {
    versionKey: false,
  },
);
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

export type BloggerDocument = BloggerDBType & Document;
export type PostsDocument = PostsDBType & Document;
export type UsersDocument = UserDBType & Document;
export type CommentsDocument = CommentsDBType & Document;
//export const BloggerModel = model<BloggerDocument>('Bloggers', MongooseAppSchema);
//export const BloggerModel = mongoose.model('Bloggers', MongooseAppSchema);
