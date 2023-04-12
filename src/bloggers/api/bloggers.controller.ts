import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  BodyForCreateBloggerType,
  BodyForUpdateBloggerType,
} from '../bloggers.types';
import { BodyTypeForPostBlogger, IdTypeForReq } from '../../posts/posts.types';
import { BasicAuthGuard } from '../../guards/basic.auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBloggerCommand } from '../application/use.case/create.blogger.use.case';
import { UpdateBloggerCommand } from '../application/use.case/update.blogger.use.case';
import { DeleteBloggerCommand } from '../application/use.case/delete.blogger.use.case';
import { FindBloggerCommand } from '../application/use.case/find.blogger.use.case';
import { CreatePostCommand } from '../../posts/application/use.case/create.post.use.case';

@Controller('/blogs')
export class BloggersController {
  constructor(protected commandBus: CommandBus) {}

  @UseGuards(BasicAuthGuard)
  @Post()
  @HttpCode(201)
  async createBlogger(@Body() inputModel: BodyForCreateBloggerType) {
    return this.commandBus.execute(
      new CreateBloggerCommand(
        inputModel.name,
        inputModel.websiteUrl,
        inputModel.description,
      ),
    );
  }

  @UseGuards(BasicAuthGuard)
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

  @UseGuards(BasicAuthGuard)
  @Delete('/:id')
  @HttpCode(204)
  async deleteBlogger(@Param() param: IdTypeForReq) {
    return this.commandBus.execute(new DeleteBloggerCommand(param.id));
  }

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
}
