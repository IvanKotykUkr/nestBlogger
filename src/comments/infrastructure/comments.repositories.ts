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
    const commentInstance = new this.CommentsModel();
    commentInstance._id = comment._id;
    commentInstance.postId = comment.postId;
    commentInstance.content = comment.content;
    commentInstance.userId = comment.userId;
    commentInstance.userLogin = comment.userLogin;
    commentInstance.createdAt = new Date();
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
    const comment = await this.CommentsModel.findById(_id);
    if (comment) {
      return this.reqComment(comment);
    }
    return 'not found';
  }

  private reqComment(comment: CommentsDBType) {
    return {
      id: comment._id,
      content: comment.content,
      userId: comment.userId,
      userLogin: comment.userLogin,
      createdAt: comment.createdAt,
    };
  }
}
