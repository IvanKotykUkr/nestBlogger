import { ObjectId } from 'mongodb';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LikesDocument = HydratedDocument<Likes>;

@Schema({ versionKey: false })
export class Likes {
  @Prop()
  _id: ObjectId;
  @Prop()
  entityId: ObjectId;
  @Prop()
  status: string;
  @Prop()
  addedAt: Date;
  @Prop()
  isVisible: boolean;
  @Prop()
  userId: ObjectId;
  @Prop()
  login: string;
}

export const LikesSchema = SchemaFactory.createForClass(Likes);
//export type LikesDocument = LikeDbType & Document;
