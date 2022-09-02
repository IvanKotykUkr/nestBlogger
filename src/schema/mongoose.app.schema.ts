import mongoose from 'mongoose';

import { BloggerDBType } from '../types/bloggers,types';
import { PostsDBType } from '../types/posts.types';

export const BloggerSchema = new mongoose.Schema<BloggerDBType>(
  {
    _id: mongoose.Types.ObjectId,
    name: { type: String, required: true },
    youtubeUrl: { type: String, required: true },
  },
  {
    versionKey: false,
  },
);
export const PostsSchema = new mongoose.Schema<PostsDBType>(
  {
    _id: mongoose.Types.ObjectId,
    title: String,
    shortDescription: String,
    content: String,
    bloggerId: mongoose.Types.ObjectId,
    bloggerName: String,
    addedAt: Date,
  },
  {
    versionKey: false,
  },
);
export type BloggerDocument = BloggerDBType & Document;
export type PostsDocument = PostsDBType & Document;
//export const BloggerModel = model<BloggerDocument>('Bloggers', MongooseAppSchema);
//export const BloggerModel = mongoose.model('Bloggers', MongooseAppSchema);
