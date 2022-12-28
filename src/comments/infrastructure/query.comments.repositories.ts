import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentsDocument } from './repository/comments.mongooose.schema';
import { ObjectId } from 'mongodb';
import {
  CommentResponseType,
  CommentsResponseTypeWithPagination,
  CommentWithLikeResponseType,
} from '../comments.types';
import { Likes, LikesDocument } from './repository/likes.mongooose.schema';
import { LikesHelper } from '../application/likes.helper';

export class QueryCommentsRepositories {
  constructor(
    @InjectModel('comments') private CommentsModel: Model<CommentsDocument>,
    @InjectModel(Likes.name) private LikesModel: Model<LikesDocument>,
    protected likesHelper: LikesHelper,
  ) {}

  async findCommentsById(
    _id: ObjectId,
    userId: ObjectId,
  ): Promise<CommentResponseType | string> {
    const comment = await this.CommentsModel.findById(_id);
    if (comment) {
      return this.reqComment(comment, userId);
    }
    return 'not found';
  }

  async findAllComments(
    id: ObjectId,
    page: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string,
    userId: ObjectId,
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
    const commentsId = this.likesHelper.takeEntityId(itemsSearch);
    const likes = await this.likesHelper.findLikes(commentsId);
    const dislikes = await this.likesHelper.findDislike(commentsId);
    const status = await this.likesHelper.findStatus(userId, commentsId);
    const items: CommentWithLikeResponseType[] = itemsSearch.map((c) => ({
      id: c._id,
      content: c.content,
      userId: c.userId,
      userLogin: c.userLogin,
      createdAt: c.createdAt,
      likesInfo: {
        likesCount: this.likesHelper.findAmountLikeOrDislike(c._id, likes),
        dislikesCount: this.likesHelper.findAmountLikeOrDislike(
          c._id,
          dislikes,
        ),
        myStatus: this.likesHelper.findStatusInArray(c._id, status),
      },
    }));

    return {
      pagesCount: pagesCountSearch,
      page: pagenumber,
      pageSize: pagesize,
      totalCount: totalCountSearch,
      items,
    };
  }

  protected async reqComment(
    comment: CommentsDocument,
    userId: ObjectId,
  ): Promise<CommentWithLikeResponseType> {
    const likesCount = await this.LikesModel.countDocuments({
      $and: [{ entityId: comment.id }, { status: 'Like' }],
    });
    const dislikesCount = await this.LikesModel.countDocuments({
      $and: [{ entityId: comment.id }, { status: 'Dislike' }],
    });
    let myStatus;
    if (userId.toString() !== '63ab296b882037600d1ce455') {
      myStatus = 'None';
    }

    return {
      id: comment._id,
      content: comment.content,
      userId: comment.userId,
      userLogin: comment.userLogin,
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount,
        dislikesCount,
        myStatus,
      },
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
