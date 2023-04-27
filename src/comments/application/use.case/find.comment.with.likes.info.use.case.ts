import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { CommentsRepositories } from '../../infrastructure/comments.repositories';
import { CommentWithLikeResponseType } from '../../comments.types';
import { NotFoundException } from '@nestjs/common';
import { LikesRepositories } from '../../infrastructure/likes.repositories';

export class FindCommentWithLikeCommand {
  constructor(public id: ObjectId) {}
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
      userId: comment.userId,
      userLogin: comment.userLogin,
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: await this.likesRepositories.countLike(comment.id),
        dislikesCount: await this.likesRepositories.countDislike(comment.id),
        myStatus: 'None',
      },
    };
  }
}
