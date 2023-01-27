import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { BloggerResponseType, QueryForPaginationType } from "../bloggers.types";
import { IdTypeForReq } from "../../posts/posts.types";
import { QueryBloggersRepositories } from "../infrastructure/query.bloggers.repositories";
import { QueryPostsRepositories } from "../../posts/infrastructure/query.posts.repositories";
import { LikesAuthGuard } from "../../auth/application/adapters/guards/likes.auth.guard";
import { Request } from "express";

export const notFoundBlogger = [
  {
    message: "NOT FOUND",
    field: "blogId",
  },
];

@Controller("/blogs")
export class QueryBloggersController {
  constructor(
    protected queryBloggersRepositories: QueryBloggersRepositories,
    protected queryPostsRepositories: QueryPostsRepositories
  ) {}

  @Get("/")
  async getBloggers(@Query() query: QueryForPaginationType) {
    const searchNameTerm = query.searchNameTerm || null;
    const pageNumber: number = query.pageNumber || 1;
    const pageSize: number = query.pageSize || 10;

    const bloggers = await this.queryBloggersRepositories.findAllBloggers(
      searchNameTerm,
      +pageNumber,
      +pageSize
    );

    return bloggers;
  }

  @Get("/:id")
  async getBlogger(@Param() param: IdTypeForReq) {
    const blogger: BloggerResponseType | string =
      await this.queryBloggersRepositories.findBloggerById(param.id);
    if (blogger !== "not found") {
      return blogger;
    }
    throw new NotFoundException(notFoundBlogger);
  }

  @UseGuards(LikesAuthGuard)
  @Get("/:id/posts")
  async getPostByBlogger(
    @Param() param: IdTypeForReq,
    @Query() query: QueryForPaginationType,
    @Req() req: Request
  ) {
    const pageNumber = query.pageNumber || 1;
    const pageSize = query.pageSize || 10;
    const sortByQuery = query.sortBy || "createdAt";
    const sortDirectionQuery = query.sortDirection || "desc";
    const blogger = await this.queryBloggersRepositories.findBloggerById(
      param.id
    );

    if (blogger === "not found") {
      throw new NotFoundException(notFoundBlogger);
    }
    return this.queryPostsRepositories.getAllPostsWithPagination(
      pageNumber,
      pageSize,
      req.userId,
      sortByQuery,
      sortDirectionQuery,
      param.id
    );
  }
}
