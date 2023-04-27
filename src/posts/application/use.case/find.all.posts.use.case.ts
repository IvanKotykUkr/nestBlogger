import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { QueryPostsRepositories } from '../../infrastructure/query.posts.repositories';
import {
  PostsDBType,
  PostsResponseTypeWithPagination,
} from '../../posts.types';
import { LikesHelper } from '../../../comments/application/likes.helper';
import { ObjectId } from 'mongodb';

export class FindAllPostsCommand {
  constructor(
    public pageNumber: number,
    public pageSize: number,
    public sortBy: string,
    public sortDirection: string,
    public userId: ObjectId,
  ) {}
}

@QueryHandler(FindAllPostsCommand)
export class FindAllPostsUseCase implements IQueryHandler<FindAllPostsCommand> {
  constructor(
    protected queryPostsRepositories: QueryPostsRepositories,
    protected likesHelper: LikesHelper,
  ) {}

  async execute(
    command: FindAllPostsCommand,
  ): Promise<PostsResponseTypeWithPagination> {
    const page: number = command.pageNumber;
    const pageSize: number = command.pageSize;
    const totalCountSearch: number =
      await this.queryPostsRepositories.findPostsByIdBloggerCount();
    const pagesCountSearch: number = Math.ceil(totalCountSearch / pageSize);
    const itemsSearch: PostsDBType[] =
      await this.queryPostsRepositories.findAllPosts(
        page,
        pageSize,
        command.sortBy,
        command.sortDirection,
      );

    const idItems = this.likesHelper.takeEntityId(itemsSearch);
    const likes = await this.likesHelper.findLikes(idItems);
    const dislikes = await this.likesHelper.findDislike(idItems);
    const status = await this.likesHelper.findStatus(command.userId, idItems);
    const allLikes = await this.likesHelper.findLastThreLikes(idItems);
    const items = itemsSearch.map((p) => ({
      id: p._id,
      title: p.title,
      shortDescription: p.shortDescription,
      content: p.content,
      blogId: p.blogId,
      blogName: p.blogName,
      createdAt: p.createdAt,
      extendedLikesInfo: {
        likesCount: this.likesHelper.findAmountLikeOrDislike(p._id, likes),
        dislikesCount: this.likesHelper.findAmountLikeOrDislike(
          p._id,
          dislikes,
        ),
        myStatus: this.likesHelper.findStatusInArray(p._id, status),
        newestLikes: this.likesHelper.groupAndSortLikes(allLikes, p._id),
      },
    }));
    return {
      pagesCount: pagesCountSearch,
      page: page,
      pageSize: pageSize,
      totalCount: totalCountSearch,
      items,
    };
  }

  private getFilter(searchNameTerm: string | null) {
    if (searchNameTerm) return { name: { $regex: searchNameTerm } };
    return {};
  }
}
