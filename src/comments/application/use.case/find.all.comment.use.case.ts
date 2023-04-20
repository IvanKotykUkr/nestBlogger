import { LikesHelper } from '../../../comments/application/likes.helper';
import { ObjectId } from 'mongodb';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QueryCommentsRepositories } from '../../infrastructure/query.comments.repositories';
import {
  CommentsResponseTypeWithPagination,
  CommentWithLikeResponseType,
} from '../../comments.types';

export class FindAllCommentCommand {
  constructor(
    public postId: ObjectId,
    public pageNumber: number,
    public pageSize: number,
    public sortBy: string,
    public sortDirection: string,
    public userId: ObjectId,
  ) {}
}

@CommandHandler(FindAllCommentCommand)
export class FindAllCommentUseCase
  implements ICommandHandler<FindAllCommentCommand>
{
  constructor(
    protected queryCommentRepositories: QueryCommentsRepositories,
    protected likesHelper: LikesHelper,
  ) {}

  async execute(
    command: FindAllCommentCommand,
  ): Promise<CommentsResponseTypeWithPagination> {
    const page: number = command.pageNumber;
    const pageSize: number = command.pageSize;
    const totalCountSearch: number =
      await this.queryCommentRepositories.commentsSearchCount(command.postId);
    const pagesCountSearch: number = Math.ceil(totalCountSearch / pageSize);
    const itemsSearch = await this.queryCommentRepositories.getComments(
      page,
      pageSize,
      command.postId,
      command.sortBy,
      command.sortDirection,
    );
    const commentsId = this.likesHelper.takeEntityId(itemsSearch);
    const likes = await this.likesHelper.findLikes(commentsId);
    const dislikes = await this.likesHelper.findDislike(commentsId);
    const status = await this.likesHelper.findStatus(
      command.userId,
      commentsId,
    );
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
      page,
      pageSize,
      totalCount: totalCountSearch,
      items,
    };
  }

  private getFilter(searchNameTerm: string | null) {
    if (searchNameTerm) return { name: { $regex: searchNameTerm } };
    return {};
  }
}
