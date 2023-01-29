import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { RecordType } from '../../../auth.types';
import { ObjectId } from 'mongodb';
import { RateRecordRepositories } from '../../../infrastructure/rate-record-repositories';

@Injectable()
export class AntiDdosGuard implements CanActivate {
  constructor(protected rateRecordRepositories: RateRecordRepositories) {}

  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    const record = this.makeRecord(req.ip, new Date(), req.url);
    const recordsForIpAndUrl = await this.rateRecordRepositories.findRecords(
      req.ip,
      req.url,
    );
    this.checkRecord(recordsForIpAndUrl);

    await this.rateRecordRepositories.createRecord(record);

    return true;
  }

  private makeRecord(ip: string, date: Date, process: string): RecordType {
    const createRecord: RecordType = {
      _id: new ObjectId(),
      ip,
      date,
      process,
    };

    return createRecord;
  }

  private checkRecord(recordsForIpAndUrl: RecordType[]) {
    if (recordsForIpAndUrl.length < 5) {
      return true;
    }
    const timeOfFirstReq: number = recordsForIpAndUrl[4]['date'].getTime();

    if (Date.now() - timeOfFirstReq <= 10000) {
      throw new HttpException(
        'TOO_MANY_REQUESTS',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    return;
  }
}
