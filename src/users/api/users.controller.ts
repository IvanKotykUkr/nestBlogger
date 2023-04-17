/*import {
  Body,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BodyForCreateUser, UsersResponseType } from '../users.types';
import { IdTypeForReq } from '../../posts/posts.types';
import { CreateUserGuard } from '../../guards/create.user.guard';
import { BasicAuthGuard } from '../../guards/basic.auth.guard';
import { CreateUserCommand } from '../application/use.case/create.user.use.case';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteUserCommand } from '../application/use.case/delete.user.use.case';

export const notFoundUser = [
  {
    message: 'NOT FOUND',
    field: 'userId',
  },
];

@Controller('/users')
export class UsersController {
  constructor(protected commandBus: CommandBus) {}

  @UseGuards(CreateUserGuard)
  @Post('/')
  @HttpCode(201)
  async createUsers(
    @Body() inputModel: BodyForCreateUser,
  ): Promise<UsersResponseType> {
    const user = await this.commandBus.execute(
      new CreateUserCommand(
        inputModel.login,
        inputModel.email,
        inputModel.password,
      ),
    );
    return user;
  }

  @UseGuards(BasicAuthGuard)
  @Delete('/:id')
  @HttpCode(204)
  async deleteUsers(@Param() param: IdTypeForReq): Promise<string> {
    const isDeleted = await this.commandBus.execute(
      new DeleteUserCommand(param.id),
    );
    if (isDeleted === true) {
      return;
    }

    throw new NotFoundException(notFoundUser);
  }
}


 */
