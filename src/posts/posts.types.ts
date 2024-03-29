import { PaginationType } from '../bloggers/bloggers.types';
import { IsEnum, IsMongoId, Length } from 'class-validator';
import { ObjectId } from 'mongodb';

export class IdTypeForReq {
  @IsMongoId()
  id: ObjectId;
}

enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

export class UpdateLikeDTO {
  @IsEnum(LikeStatus)
  likeStatus: LikeStatus;
}

export class BodyTypeForPostBlogger {
  @Length(1, 30)
  title: string;
  @Length(1, 100)
  shortDescription: string;
  @Length(1, 1000)
  content: string;
}

export class BodyTypeForPost {
  @Length(1, 30)
  title: string;
  @Length(1, 100)
  shortDescription: string;
  @Length(1, 1000)
  content: string;
}

export type PostsDBType = {
  _id: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: ObjectId;
  blogName: string;
  ownerBlogId: ObjectId;
  isVisible: boolean;
  createdAt: Date;
};
export type PostUpdatedType = {
  _id: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: ObjectId;
  blogName: string;
};
export type PostsResponseType = {
  id?: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: ObjectId;
  blogName: string;
  createdAt: Date;
  /* extendedLikesInfo: {
                                                     likesCount: number;
                                                     dislikesCount: number;
                                                     myStatus: string;
                                                     newestLikes: Array<{
                                                       addedAt?: Date;
                                                       userId?: ObjectId;
                                                       login?: string;
                                                     }>;
                                                   };
                                                   
                                                   */
};

export type PostsLikeResponseType = {
  id?: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: ObjectId;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: Array<{
      addedAt?: Date;
      userId?: ObjectId;
      login?: string;
    }>;
  };
};
export type CheckBloggerType = {
  _id: ObjectId;
  name: string;
};
export type PostsResponseTypeWithPagination =
  PaginationType<PostsLikeResponseType>;
export type NewestLike = {
  addedAt: Date;
  userId: ObjectId;
  login: string;
};
