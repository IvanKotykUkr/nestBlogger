import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PostsDBType,
  PostsResponseType,
  PostUpdatedType,
} from '../posts.types';
import { ObjectId } from 'mongodb';
import { PostsDocument } from './repository/posts.mongoose.schema';

@Injectable()
export class PostsRepositories {
  constructor(@InjectModel('posts') private PostModel: Model<PostsDocument>) {}

  resPost(post: PostsDBType): PostsResponseType {
    return {
      id: post._id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
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
    postsInstance.blogId = newPost.blogId;
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
    post.blogId = newPost.blogId;
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

  async findPostById(id: ObjectId): Promise<PostsResponseType | string> {
    const post = await this.PostModel.findById(id);
    if (post) {
      return this.resPost(post);
    }
    return 'not found';
  }
}
