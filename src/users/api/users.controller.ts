import { UsersService } from '../application/users.service';
import {
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

export const notFoundUser = [
  {
    message: 'NOT FOUND',
    field: 'userId',
  },
];

@Controller('/users')
export class UsersController {
  constructor(protected usersService: UsersService) {}

  @UseGuards(CreateUserGuard)
  @Post('/')
  @HttpCode(201)
  async createUsers(
    @Body() inputModel: BodyForCreateUser,
  ): Promise<UsersResponseType> {
    return this.usersService.createUsers(
      inputModel.login,
      inputModel.email,
      inputModel.password,
    );
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteUsers(@Param() param: IdTypeForReq): Promise<string> {
    const isDeleted = await this.usersService.deleteUsers(param.id);
    if (isDeleted === true) {
      return;
    }

    throw new NotFoundException(notFoundUser);
  }
}
