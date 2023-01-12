import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  NewestLike,
  PostsDBType,
  PostsLikeResponseType,
  PostsResponseType,
  PostsResponseTypeWithPagination,
} from '../posts.types';
import { ObjectId } from 'mongodb';
import { PostsDocument } from './repository/posts.mongoose.schema';
import {
  Likes,
  LikesDocument,
} from '../../comments/infrastructure/repository/likes.mongooose.schema';
import { LikesHelper } from '../../comments/application/likes.helper';

@Injectable()
export class QueryPostsRepositories {
  constructor(
    @InjectModel('posts') private PostModel: Model<PostsDocument>,
    @InjectModel(Likes.name) private LikesModel: Model<LikesDocument>,
    protected likesHelper: LikesHelper,
  ) {}

  resPost(post: PostsDBType): PostsResponseType {
    return {
      id: post._id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
    };
  }

  async findPostById(_id: ObjectId): Promise<PostsResponseType | string> {
    const post = await this.PostModel.findById(_id);
    if (post) {
      return this.resPost(post);
    }

    return 'not found';
  }

  paginationFilter(blogId: undefined | ObjectId) {
    const filter = {};
    if (blogId) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      return { blogId };
    }
    return filter;
  }

  async findPostsByIdBloggerCount(
    blogId: undefined | ObjectId,
  ): Promise<number> {
    const filter = this.paginationFilter(blogId);

    return this.PostModel.countDocuments(filter);
  }

  async findAllPosts(
    blogId: undefined | ObjectId,
    number: number,
    size: number,
    sortBy: string,
    sortDirection: string,
  ): Promise<PostsDBType[]> {
    const filter = await this.paginationFilter(blogId);
    const direction = this.getDirection(sortDirection);
    return (
      this.PostModel.find(filter)
        .sort({ sortBy: direction })
        //.skip((number - 1) * size)
        .skip(number > 0 ? (number - 1) * size : 0)

        .limit(size)
        .exec()
    );

    //   return posts.sort(this.compareValues(sortBy, sortDirection));
  }

  async getAllPostsWithPagination(
    number: number,
    size: number,
    userId: ObjectId,
    sortBy: string,
    sortDirection: string,
    blogId?: ObjectId,
  ): Promise<PostsResponseTypeWithPagination> {
    const totalCountSearch: number = await this.findPostsByIdBloggerCount(
      blogId,
    );
    const pagenumber: number = number;
    const pagesize: number = size;
    const pagesCountSearch: number = Math.ceil(totalCountSearch / pagesize);
    const itemsFromDb: PostsDBType[] = await this.findAllPosts(
      blogId,
      pagenumber,
      pagesize,
      sortBy,
      sortDirection,
    );

    const idItems = this.likesHelper.takeEntityId(itemsFromDb);
    const likes = await this.likesHelper.findLikes(idItems);
    const dislikes = await this.likesHelper.findDislike(idItems);
    const status = await this.likesHelper.findStatus(userId, idItems);
    const allLikes = await this.likesHelper.findLastThreLikes(idItems);
    const items = itemsFromDb.map((p) => ({
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
      page: pagenumber,
      pageSize: pagesize,
      totalCount: totalCountSearch,
      items,
    };
  }

  async findPostWithLikeById(
    _id: ObjectId,
    userId: ObjectId,
  ): Promise<PostsLikeResponseType | string> {
    const post = await this.PostModel.findById(_id);
    if (!post) return 'not found';
    const likesCount = await this.LikesModel.countDocuments({
      $and: [{ entityId: post.id }, { status: 'Like' }],
    });
    const dislikesCount = await this.LikesModel.countDocuments({
      $and: [{ entityId: post.id }, { status: 'Dislike' }],
    });
    let myStatus;
    const status = await this.LikesModel.findOne({
      $and: [{ entityId: post.id }, { userId }],
    });
    if (status) {
      myStatus = status.status;
    } else {
      myStatus = 'None';
    }
    return {
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount,
        dislikesCount,
        myStatus,
        newestLikes: await this.newestLike(post.id),
      },
    };
  }

  private async newestLike(post: ObjectId): Promise<NewestLike[]> {
    const likeInstance = await this.LikesModel.find({
      $and: [{ entityId: post }, { status: 'Like' }],
    })
      .sort({ addedAt: -1 })
      .limit(3)
      .lean();
    return likeInstance.map((d) => ({
      addedAt: d.addedAt,
      userId: d.userId,
      login: d.login,
    }));
  }

  private getDirection(sortDirection: string): 1 | -1 {
    if (sortDirection.toString() === 'asc') {
      return 1;
    }
    if (sortDirection.toString() === 'desc') {
      return -1;
    }
  }
}
