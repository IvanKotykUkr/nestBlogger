import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  BodyForCreateBloggerType,
  BodyForUpdateBloggerType,
  QueryForPaginationType,
} from '../bloggers.types';
import { CreateBloggerCommand } from '../application/use.case/create.blogger.use.case';
import { JwtAuthGuard } from '../../auth/application/adapters/guards/jwt-auth.guard';
import { CurrentUserId } from '../../types/decorator';
import { ObjectId } from 'mongodb';
import { CheckOwnBlogGuard } from '../../auth/application/adapters/guards/autherisation-guard.service';
import { IdTypeForReq } from '../../posts/posts.types';
import { UpdateBloggerCommand } from '../application/use.case/update.blogger.use.case';
import { DeleteBloggerCommand } from '../application/use.case/delete.blogger.use.case';
import { FindALLOwnedBlogsCommand } from '../application/use.case/query.Use.Case/find.all.owned.blogs.use.case';

@Controller('blogger/blogs')
export class BloggersController {
  constructor(protected commandBus: CommandBus, protected queryBus: QueryBus) {}

  @UseGuards(JwtAuthGuard)
  @Post('/')
  @HttpCode(201)
  async createBlogger(
    @CurrentUserId() userId: ObjectId,
    @Body() inputModel: BodyForCreateBloggerType,
  ) {
    return this.commandBus.execute(
      new CreateBloggerCommand(
        inputModel.name,
        inputModel.websiteUrl,
        inputModel.description,
        userId,
      ),
    );
  }

  @UseGuards(JwtAuthGuard, CheckOwnBlogGuard)
  @Put('/:id')
  @HttpCode(204)
  async updateBlogger(
    @Param() param: IdTypeForReq,
    @Body() inputModel: BodyForUpdateBloggerType,
  ) {
    return this.commandBus.execute(
      new UpdateBloggerCommand(
        param.id,
        inputModel.name,
        inputModel.websiteUrl,
        inputModel.description,
      ),
    );
  }

  @UseGuards(JwtAuthGuard, CheckOwnBlogGuard)
  @Delete('/:id')
  @HttpCode(204)
  async deleteBlogger(@Param() param: IdTypeForReq) {
    return this.commandBus.execute(new DeleteBloggerCommand(param.id));
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getAllBlogs(
    @CurrentUserId() userId: ObjectId,
    @Query() query: QueryForPaginationType,
  ) {
    const searchNameTerm = query.searchNameTerm || null;
    const pageNumber: number = query.pageNumber || 1;
    const pageSize: number = query.pageSize || 10;
    const sortBy = query.sortBy || 'createdAt';
    const sortDirection = query.sortDirection || 'desc';
    return this.queryBus.execute(
      new FindALLOwnedBlogsCommand(
        userId,
        searchNameTerm,
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
      ),
    );
  }

  /*
    @UseGuards(BasicAuthGuard)
    @Post('/:id/posts')
    async createPostByBlogger(
      @Param() param: IdTypeForReq,
      @Body() inputModel: BodyTypeForPostBlogger,
    ) {
      const blogger = await this.commandBus.execute(
        new FindBloggerCommand(param.id),
      );
  
      return this.commandBus.execute(
        new CreatePostCommand(
          blogger.id,
          inputModel.title,
          inputModel.shortDescription,
          inputModel.content,
          blogger.name,
        ),
      );
    }

   */
}
