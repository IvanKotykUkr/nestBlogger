import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  NewestLike,
  PostsDBType,
  PostsLikeResponseType,
  PostsResponseType,
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

  paginationFilter(blogId: undefined | ObjectId) {
    const filter = { isVisible: { $ne: false } };
    if (blogId) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      return {
        $and: [{ blogId }, { isVisible: { $ne: false } }],
      };
    }
    return filter;
  }

  async findPostsByIdBloggerCount(
    blogId?: undefined | ObjectId,
  ): Promise<number> {
    const filter = this.paginationFilter(blogId);

    return this.PostModel.countDocuments(filter);
  }

  async findAllPosts(
    number: number,
    size: number,
    sortBy: string,
    sortDirection: string,
  ): Promise<PostsDBType[]> {
    const direction = this.getDirection(sortDirection);
    return (
      this.PostModel.find({ isVisible: { $ne: false } })
        .sort({ [sortBy]: direction })
        //.skip((number - 1) * size)
        .skip(number > 0 ? (number - 1) * size : 0)

        .limit(size)
        .exec()
    );

    //   return posts.sort(this.compareValues(sortBy, sortDirection));
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
