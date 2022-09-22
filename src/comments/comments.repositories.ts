import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentsDocument } from '../schema/mongoose.app.schema';

export class CommentsRepositories {
  constructor(
    @InjectModel('comments') private CommentsModel: Model<CommentsDocument>,
  ) {}
}
