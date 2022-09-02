import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId } from 'mongoose';
import { PostsDocument } from '../schema/mongoose.app.schema';
import {
  PostsDBType,
  PostsResponseType,
  PostUpdatedType,
} from '../types/posts.types';

@Injectable()
export class PostsRepositories {
  constructor(@InjectModel('posts') private PostModel: Model<PostsDocument>) {}

  resPost(post: PostsDBType): PostsResponseType {
    return {
      id: post._id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      bloggerId: post.bloggerId,
      bloggerName: post.bloggerName,
      addedAt: post.addedAt,
    };
  }

  async createPost(newPost: PostsDBType): Promise<PostsResponseType> {
    const postsInstance = new this.PostModel();
    postsInstance._id = newPost._id;
    postsInstance.title = newPost.title;
    postsInstance.shortDescription = newPost.shortDescription;
    postsInstance.content = newPost.content;
    postsInstance.bloggerId = newPost.bloggerId;
    postsInstance.bloggerName = newPost.bloggerName;
    postsInstance.addedAt = new Date();
    await postsInstance.save();
    return this.resPost(postsInstance);
  }

  async findPostById(id: ObjectId): Promise<PostsResponseType | string> {
    const post = await this.PostModel.findById(id);
    if (post) {
      return this.resPost(post);
    }
    return 'not found';
  }

  async paginationFilter(bloggerId: undefined | mongoose.Types.ObjectId) {
    const filter = {};
    if (bloggerId) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      return { bloggerId };
    }
    return filter;
  }

  async findPostsByIdBloggerCount(
    bloggerId: undefined | mongoose.Types.ObjectId,
  ): Promise<number> {
    const filter = await this.paginationFilter(bloggerId);

    return this.PostModel.countDocuments(filter);
  }

  async findAllPosts(
    bloggerId: undefined | mongoose.Types.ObjectId,
    number: number,
    size: number,
  ): Promise<PostsDBType[]> {
    const filter = await this.paginationFilter(bloggerId);

    return (
      this.PostModel.find(filter)
        //.skip((number - 1) * size)
        .skip(number > 0 ? (number - 1) * size : 0)
        .limit(size)
        .lean()
    );
  }

  async updatePost(newPost: PostUpdatedType): Promise<boolean | string> {
    const post = await this.PostModel.findById(newPost._id);
    if (!post) return 'not found post';
    post.title = newPost.title;
    post.shortDescription = newPost.shortDescription;
    post.content = newPost.content;
    post.bloggerId = newPost.bloggerId;
    post.bloggerName = newPost.bloggerName;
    await post.save();
    return true;
  }

  async deletePost(postId: mongoose.Types.ObjectId) {
    const post = await this.PostModel.findById(postId);
    if (!post) return 'not found';

    await post.deleteOne();

    return true;
  }
}
