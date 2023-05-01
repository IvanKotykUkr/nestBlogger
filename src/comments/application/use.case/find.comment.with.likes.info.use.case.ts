import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { CommentsRepositories } from '../../infrastructure/comments.repositories';
import { CommentWithLikeResponseType } from '../../comments.types';
import { NotFoundException } from '@nestjs/common';
import { LikesRepositories } from '../../infrastructure/likes.repositories';

export class FindCommentWithLikeCommand {
  constructor(public id: ObjectId, public userId: ObjectId) {}
}

@CommandHandler(FindCommentWithLikeCommand)
export class FindCommentWithLikeUseCase
  implements ICommandHandler<FindCommentWithLikeCommand>
{
  constructor(
    protected commentsRepositories: CommentsRepositories,
    protected likesRepositories: LikesRepositories,
  ) {}

  async execute(
    command: FindCommentWithLikeCommand,
  ): Promise<CommentWithLikeResponseType> {
    const comment = await this.commentsRepositories.findCommentsById(
      command.id,
    );
    if (typeof comment === 'string') {
      throw new NotFoundException([
        {
          message: 'comment with specified id doesnt exists',
          field: 'comment Id',
        },
      ]);
    }
    return {
      id: comment.id,
      content: comment.content,
      commentatorInfo: comment.commentatorInfo,
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: await this.likesRepositories.countLike(comment.id),
        dislikesCount: await this.likesRepositories.countDislike(comment.id),
        myStatus: await this.checkStatus(comment.id, command.userId),
      },
    };
  }

  private async checkStatus(id: ObjectId, userId: ObjectId) {
    if (userId.toString() === '63ab296b882037600d1ce455') return 'None';
    return this.likesRepositories.findMyStatus(userId, id);
  }
}
