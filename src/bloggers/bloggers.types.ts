import {
  IsMongoId,
  isNotEmpty,
  isString,
  IsUrl,
  Length,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { ObjectId } from 'mongodb';

export type QueryForPaginationType = {
  searchNameTerm: string;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: string;
};
export type createBloggerType = {
  name: string;

  description: string;

  websiteUrl: string;
};

export function IsNotEmptyString(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'isNotEmptyString',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any): boolean =>
          isString(value) && isNotEmpty(value.trim()),
        defaultMessage: (validationArguments?: ValidationArguments): string =>
          `${validationArguments.property} should not be an empty string`,
      },
    });
  };
}

export class BodyForCreateBloggerType {
  @IsNotEmptyString()
  @Length(1, 15)
  name: string;
  @Length(1, 500)
  description: string;
  @IsUrl()
  websiteUrl: string;
}

export class BodyForUpdateBloggerType {
  @Length(1, 15)
  name: string;
  @Length(1, 500)
  description: string;
  @IsUrl()
  websiteUrl: string;
}

export class IdTypeForReqPost {
  @IsMongoId()
  id: ObjectId;
  @IsMongoId()
  postId: ObjectId;
}

export type BloggerDBType = {
  _id: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  ownerId: ObjectId;
  createdAt: Date;
  isMembership: boolean;
};

export type BloggerType = {
  id?: ObjectId;
  _id?: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  ownerId?: ObjectId;
  createdAt: Date;
  isMembership: boolean;
};
export type BloggerTypeForUpdate = {
  id?: ObjectId;
  _id?: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
};
export type BloggerResponseType = {
  id: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;
};
export type PaginationType<T> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
};

export type BloggSearchFilerType =
  | { $and: ({ ownerId: ObjectId } | { name: { $regex: string } })[] }
  | {
      ownerId: ObjectId;
    }
  | { name: { $regex: string } }
  | {};

export type BloggerResponseTypeWithPagination =
  PaginationType<BloggerResponseType>;
