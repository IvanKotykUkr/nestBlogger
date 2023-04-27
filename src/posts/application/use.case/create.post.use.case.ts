import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { PostsDBType, PostsResponseType } from '../../posts.types';
import { PostsRepositories } from '../../infrastructure/posts.repositories';

export class CreatePostCommand {
  constructor(
    public id: ObjectId,
    public title: string,
    public shortDescription: string,
    public content: string,
    public bloggerName: string,
    public userId: ObjectId,
  ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(protected postRepositories: PostsRepositories) {}

  async execute(
    command: CreatePostCommand,
  ): Promise<PostsResponseType | string> {
    const post = this.makePost(
      command.title,
      command.shortDescription,
      command.content,
      command.id,
      command.bloggerName,
      command.userId,
    );
    return this.postRepositories.createPost(post);
  }

  private makePost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: ObjectId,
    blogName: string,
    ownerOfBlogId: ObjectId,
  ): PostsDBType {
    const newPost: PostsDBType = {
      _id: new ObjectId(),
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId,
      blogName,
      ownerBlogId: ownerOfBlogId,
      isVisible: true,
      createdAt: new Date(),
    };
    return newPost;
  }
}
