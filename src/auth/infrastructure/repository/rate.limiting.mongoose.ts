import { RecordType } from '../../auth.types';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

export const LimitingSchema = new mongoose.Schema<RecordType>(
  {
    _id: ObjectId,
    ip: String,
    date: Date,
    process: String,
  },
  {
    versionKey: false,
  },
);

export type LimitingDocument = RecordType & Document;
