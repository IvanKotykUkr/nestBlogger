import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentsDocument } from './repository/comments.mongooose.schema';
import { CommentResponseType, CommentsDBType } from '../comments.types';
import { ObjectId } from 'mongodb';

export class CommentsRepositories {
  constructor(
    @InjectModel('comments') private CommentsModel: Model<CommentsDocument>,
  ) {}

  async createComment(comment: CommentsDBType): Promise<CommentResponseType> {
    const commentInstance = await new this.CommentsModel(comment);

    await commentInstance.save();

    return this.reqComment(commentInstance);
  }

  async updateComment(_id: ObjectId, content: string): Promise<boolean> {
    const comment = await this.CommentsModel.findById({ _id });
    comment.content = content;
    await comment.save();
    return true;
  }

  async deleteComment(_id: ObjectId): Promise<boolean> {
    const comment = await this.CommentsModel.findById({ _id });
    comment.deleteOne();
    return true;
  }

  async findCommentsById(_id: ObjectId): Promise<CommentResponseType | string> {
    const comment = await this.CommentsModel.findOne({
      $and: [{ _id }, { isVisible: { $ne: false } }],
    });
    if (comment) {
      return this.reqComment(comment);
    }
    return 'not found';
  }

  async makeCommentInvisible(userId: ObjectId) {
    return this.CommentsModel.updateMany({ userId }, { isVisible: false });
  }

  async makeCommentVisible(userId: ObjectId) {
    return this.CommentsModel.updateMany({ userId }, { isVisible: true });
  }

  private reqComment(comment: CommentsDBType) {
    return {
      id: comment._id,
      content: comment.content,
      commentatorInfo: comment.commentatorInfo,
      createdAt: comment.createdAt,
      likesInfo: {
        dislikesCount: 0,
        likesCount: 0,
        myStatus: 'None',
      },
    };
  }
}
