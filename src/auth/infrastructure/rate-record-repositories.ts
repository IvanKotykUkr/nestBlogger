import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LimitingDocument } from './repository/rate.limiting.mongoose';
import { RecordType } from '../auth.types';

@Injectable()
export class RateRecordRepositories {
  constructor(
    @InjectModel('rate record') protected RecordModel: Model<LimitingDocument>,
  ) {}

  async createRecord(record: RecordType) {
    const newRecord = new this.RecordModel();
    newRecord._id = record._id;
    newRecord.ip = record.ip;
    newRecord.date = record.date;
    newRecord.process = record.process;
    await newRecord.save();
    return;
  }

  async findRecords(ip: string, process: string): Promise<RecordType[]> {
    const ipFound = await this.RecordModel.find({
      ip: ip,
      process: process,
    })
      .sort({ date: -1 })
      .limit(5)
      .lean();
    return ipFound;
  }

  async deleteAllRecord(): Promise<boolean> {
    await this.RecordModel.deleteMany();
    return true;
  }
}
