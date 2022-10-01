/*
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




 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

@Schema()
export class BloggerMongoose {
  @Prop()
  _id: ObjectId;
  @Prop()
  name: string;
  @Prop()
  youtubeUrl: string;
}

export const BloggerSchema = SchemaFactory.createForClass(BloggerMongoose);
export type BloggerDocument = BloggerMongoose & Document;
