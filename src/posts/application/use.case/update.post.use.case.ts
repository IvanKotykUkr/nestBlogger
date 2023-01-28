import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { PostUpdatedType } from '../../posts.types';
import { PostsRepositories } from '../../infrastructure/posts.repositories';

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

    return this.postRepositories.updatePost(newPost);
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
