import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { PostUpdatedType } from '../../posts.types';
import { PostsRepositories } from '../../infrastructure/posts.repositories';
import { NotFoundException } from '@nestjs/common';

import { notFoundPost } from '../../../constants';

export class UpdatePostCommand {
  constructor(
    public postId: ObjectId,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: ObjectId,
    public blogName: string,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(protected postRepositories: PostsRepositories) {}

  async execute(command: UpdatePostCommand): Promise<boolean | string> {
    const newPost = this.updatePost(
      command.postId,
      command.title,
      command.shortDescription,
      command.content,
      command.blogId,
      command.blogName,
    );

    const post = await this.postRepositories.updatePost(newPost);
    if (typeof post === 'string') {
      throw new NotFoundException(notFoundPost);
    }
    return post;
  }

  private updatePost(
    postId: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: ObjectId,
    blogName: string,
  ): PostUpdatedType {
    const newPost: PostUpdatedType = {
      _id: postId,
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId,
      blogName,
    };
    return newPost;
  }
}
