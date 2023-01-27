import {
  Body,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { PostsService } from "../application/posts.service";
import { BodyTypeForPost, IdTypeForReq, UpdateLikeDTO } from "../posts.types";
import { notFoundBlogger } from "../../bloggers/api/bloggers.controller";
import { BasicAuthGuard } from "../../guards/basic.auth.guard";
import { BodyForComments } from "../../comments/comments.types";
import { AuthGuard } from "../../auth/application/adapters/guards/auth.guard";
import { Request } from "express";
import { CommandBus } from "@nestjs/cqrs";
import { FindBloggerCommand } from "../../bloggers/application/use.case/find.blogger.use.case";
import { CreatePostCommand } from "../application/use.case/create.post.use.case";
import { UpdatePostCommand } from "../application/use.case/update.post.use.case";
import { DeletePostCommand } from "../application/use.case/delete.post.use.case";
import { FindPostCommand } from "../application/use.case/find.post.use.case";
import { CreateCommentCommand } from "../../comments/application/use.case/create.comment.use.case";
import { UpdateLikeCommand } from "../../comments/application/use.case/update.like.use.case";

export const notFoundPost = [
  {
    message: "NOT FOUND",
    field: "postId",
  },
];

@Controller("/posts")
export class PostsController {
  constructor(
    protected commandBus: CommandBus,
    protected postsService: PostsService
  ) {}

  @UseGuards(AuthGuard)
  @Post("/:id/comments")
  async createComment(
    @Body() body: BodyForComments,
    @Param() param: IdTypeForReq,
    @Req() request: Request
  ) {
    const post = await this.commandBus.execute(new FindPostCommand(param.id));
    if (typeof post === "string") {
      throw new NotFoundException(notFoundPost);
    }
    return this.commandBus.execute(
      new CreateCommentCommand(
        param.id,
        body.content,
        request.user.id,
        request.user.login
      )
    );
  }

  @UseGuards(BasicAuthGuard)
  @Post("/")
  async createPost(@Body() inputModel: BodyTypeForPost) {
    const blogger = await this.commandBus.execute(
      new FindBloggerCommand(inputModel.blogId)
    );
    if (blogger === "not found") {
      throw new NotFoundException(notFoundBlogger);
    }

    return this.commandBus.execute(
      new CreatePostCommand(
        blogger.id,
        inputModel.title,
        inputModel.shortDescription,
        inputModel.content,
        blogger.name
      )
    );
  }

  @UseGuards(BasicAuthGuard)
  @Put("/:id")
  @HttpCode(204)
  async updatePost(
    @Param() param: IdTypeForReq,
    @Body() inputModel: BodyTypeForPost
  ) {
    const blogger = await this.commandBus.execute(
      new FindBloggerCommand(inputModel.blogId)
    );
    if (blogger === "not found") {
      throw new NotFoundException(notFoundBlogger);
    }
    const isUpdated = await this.commandBus.execute(
      new UpdatePostCommand(
        param.id,
        inputModel.title,
        inputModel.shortDescription,
        inputModel.content,
        inputModel.blogId,
        blogger.name
      )
    );
    if (typeof isUpdated !== "string") {
      return isUpdated;
    }
    throw new NotFoundException(notFoundPost);
  }

  @UseGuards(AuthGuard)
  @Put("/:id/like-status")
  @HttpCode(204)
  async updateLikeStatus(
    @Param() param: IdTypeForReq,
    @Body() inputModel: UpdateLikeDTO,
    @Req() req: Request
  ) {
    const post = await this.commandBus.execute(new FindPostCommand(param.id));
    if (typeof post === "string") {
      throw new NotFoundException(notFoundPost);
    }
    return this.commandBus.execute(
      new UpdateLikeCommand(
        param.id,
        inputModel.likeStatus,
        req.user.id,
        req.user.login
      )
    );
  }

  @UseGuards(BasicAuthGuard)
  @Delete("/:id")
  @HttpCode(204)
  async deleteBlogger(@Param() param: IdTypeForReq) {
    const isDeleted = await this.commandBus.execute(
      new DeletePostCommand(param.id)
    );
    if (typeof isDeleted !== "string") {
      return isDeleted;
    }
    throw new NotFoundException(notFoundPost);
  }
}
