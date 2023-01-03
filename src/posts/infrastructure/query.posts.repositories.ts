import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PostsDBType,
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
      addedAt: post.addedAt,
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
  ): Promise<PostsDBType[]> {
    const filter = await this.paginationFilter(blogId);

    return (
      this.PostModel.find(filter)
        //.skip((number - 1) * size)
        .skip(number > 0 ? (number - 1) * size : 0)
        .limit(size)
        .lean()
    );
  }

  async getAllPostsWithPagination(
    number: number,
    size: number,
    userId: ObjectId,
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
      addedAt: p.addedAt,
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
}
