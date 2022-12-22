/*
export const BloggerSchema = new mongoose.Schema<BloggerDBType>(
  {
    _id: ObjectId,
    name: { type: String, required: true },
    websiteUrl: { type: String, required: true },
  },
  {
    versionKey: false,
  },
);




 */
import mongoose, { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { BloggerDBType } from '../../bloggers.types';

export const BloggerSchema = new mongoose.Schema<BloggerDBType>(
  {
    _id: ObjectId,
    name: String,
    description: String,
    websiteUrl: String,
    createdAt: Date,
  },
  {
    versionKey: false,
  },
);

//export const BloggerSchema = SchemaFactory.createForClass(BloggerMongoose);
export type BloggerDocument = BloggerDBType & Document;
