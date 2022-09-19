import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostsDocument } from '../schema/mongoose.app.schema';
import {
  PostsDBType,
  PostsResponseType,
  PostUpdatedType,
} from '../types/posts.types';
import { ObjectId } from 'mongodb';

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

  async deletePost(postId: ObjectId) {
    const post = await this.PostModel.findById(postId);
    if (!post) return 'not found';

    await post.deleteOne();

    return true;
  }
}
