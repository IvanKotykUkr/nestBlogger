import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PostsDBType,
  PostsLikeResponseType,
  PostsResponseType,
  PostUpdatedType,
} from '../posts.types';
import { ObjectId } from 'mongodb';
import { PostsDocument } from './repository/posts.mongoose.schema';

@Injectable()
export class PostsRepositories {
  constructor(@InjectModel('posts') private PostModel: Model<PostsDocument>) {}

  resPost(post: PostsDBType): PostsLikeResponseType {
    return {
      id: post._id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };
  }

  async createPost(newPost: PostsDBType): Promise<PostsResponseType> {
    const postsInstance = await new this.PostModel(newPost);

    await postsInstance.save();
    return this.resPost(postsInstance);
  }

  async updatePost(newPost: PostUpdatedType): Promise<boolean | string> {
    const post = await this.PostModel.findById(newPost._id);
    if (!post) return 'not found post';
    post.title = newPost.title;
    post.shortDescription = newPost.shortDescription;
    post.content = newPost.content;
    post.blogId = newPost.blogId;
    post.blogName = newPost.blogName;
    await post.save();
    return true;
  }

  async deletePost(postId: ObjectId) {
    const post = await this.PostModel.findById(postId);
    if (!post) return 'not found';

    await post.deleteOne();

    return true;
  }

  async findPostById(id: ObjectId): Promise<PostsResponseType | string> {
    const post = await this.PostModel.findById({
      $and: [{ id }, { isVisible: { $ne: false } }],
    });
    if (post) {
      return this.resPost(post);
    }
    return 'not found';
  }

  async makePostInvisible(userId: ObjectId) {
    return this.PostModel.updateMany(
      { ownerBlogId: userId },
      { isVisible: false },
    );
  }

  async makePostVisible(userId: ObjectId) {
    return this.PostModel.updateMany(
      { ownerBlogId: userId },
      { isVisible: true },
    );
  }
}
