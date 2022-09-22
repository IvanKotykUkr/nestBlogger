import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentsDocument } from '../schema/mongoose.app.schema';
import { ObjectId } from 'mongodb';
import { CommentsResponseTypeWithPagination } from '../types/comments.types';

export class QueryCommentsRepositories {
  constructor(
    @InjectModel('comments') private CommentsModel: Model<CommentsDocument>,
  ) {}

  async findCommentsById(_id: ObjectId): Promise<ObjectId | string> {
    const comment = await this.CommentsModel.findById(_id);
    if (comment) {
      return comment._id;
    }
    return 'not found';
  }

  async findAllComments(
    id: ObjectId,
    PageNumber: number,
    PageSize: number,
  ): Promise<CommentsResponseTypeWithPagination> {
    const page: number = PageNumber;
    const pageSize: number = PageSize;
    const totalCountSearch: number = await this.commentsSearchCount();
    const pagesCountSearch: number = Math.ceil(totalCountSearch / pageSize);
    const itemsSearch = await this.getComments(pageSize, page, id);

    return {
      pagesCount: pagesCountSearch,
      page,
      pageSize,
      totalCount: totalCountSearch,
      items: itemsSearch.map((c)=>[{id:c.id,conntent:c.content,uswr
      ;Use}])
    };
  }

  private async commentsSearchCount(): Promise<number> {
    return this.CommentsModel.countDocuments();
  }

  private async getComments(pageSize: number, page: number, _id) {
    return this.CommentsModel.find({ postid: _id });
  }
}
