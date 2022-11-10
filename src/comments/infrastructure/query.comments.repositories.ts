import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentsDocument } from './repository/comments.mongooose.schema';
import { ObjectId } from 'mongodb';
import {
  CommentResponseType,
  CommentsResponseTypeWithPagination,
} from '../comments.types';

export class QueryCommentsRepositories {
  constructor(
    @InjectModel('comments') private CommentsModel: Model<CommentsDocument>,
  ) {}

  async findCommentsById(_id: ObjectId): Promise<CommentResponseType | string> {
    const comment = await this.CommentsModel.findById(_id);
    if (comment) {
      return this.reqComment(comment);
    }
    return 'not found';
  }

  async findAllComments(
    id: ObjectId,
    page: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string,
  ): Promise<CommentsResponseTypeWithPagination> {
    const pagenumber: number = page;
    const pagesize: number = pageSize;
    const totalCountSearch: number = await this.commentsSearchCount(id);
    const pagesCountSearch: number = Math.ceil(totalCountSearch / pageSize);
    const itemsSearch = await this.getComments(
      pageSize,
      page,
      id,
      sortBy,
      sortDirection,
    );
    const items = itemsSearch.map((c) => ({
      id: c._id,
      content: c.content,
      userId: c.userId,
      userLogin: c.userLogin,
      createdAt: c.createdAt,
    }));

    return {
      pagesCount: pagesCountSearch,
      page: pagenumber,
      pageSize: pagesize,
      totalCount: totalCountSearch,
      items,
    };
  }

  protected reqComment(comment: CommentsDocument) {
    return {
      id: comment._id,
      content: comment.content,
      userId: comment.userId,
      userLogin: comment.userLogin,
      createdAt: comment.createdAt,
    };
  }

  private async commentsSearchCount(postId): Promise<number> {
    return this.CommentsModel.countDocuments({ postId });
  }

  private async getComments(
    pageSize: number,
    page: number,
    postId: ObjectId,
    sortBy: string,
    sortDirection: string,
  ) {
    const direction = this.getDirection(sortDirection);
    return this.CommentsModel.find({ postId })
      .skip(page > 0 ? (page - 1) * pageSize : 0)
      .sort({ [sortBy]: direction })
      .limit(pageSize)
      .lean();
  }

  private getDirection(sortDirection: string) {
    if (sortDirection.toString() === 'asc') {
      return 1;
    }
    if (sortDirection.toString() === 'desc') {
      return -1;
    }
  }
}
