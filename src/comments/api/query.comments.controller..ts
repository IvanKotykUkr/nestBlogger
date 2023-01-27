import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from "@nestjs/common";
import { IdTypeForReq } from "../../posts/posts.types";
import { QueryCommentsRepositories } from "../infrastructure/query.comments.repositories";
import { LikesAuthGuard } from "../../auth/application/adapters/guards/likes.auth.guard";
import { Request } from "express";

@Controller("/comments")
export class QueryCommentsController {
  constructor(protected queryCommentsRepositories: QueryCommentsRepositories) {}

  @UseGuards(LikesAuthGuard)
  @Get("/:id")
  async getComment(@Param() param: IdTypeForReq, @Req() req: Request) {
    const comment = await this.queryCommentsRepositories.findCommentsById(
      param.id,
      req.userId
    );
    if (typeof comment === "string") {
      throw new NotFoundException([{ message: "no comment", field: "id" }]);
    }
    return comment;
  }
}
