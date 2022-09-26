import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { QueryUsersRepositories } from './users/query.users.repositories';

@Injectable()
export class CreateUserGuard implements CanActivate {
  constructor(protected queryUsersRepositories: QueryUsersRepositories) {}

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const user = await this.queryUsersRepositories.checkUseLoginOrEmail(
      request.body.login,
      request.body.email,
    );
    if (typeof user === 'string') return true;
    if (user.accountData.login === request.body.email) {
      throw new BadRequestException([
        { message: 'login already exist', field: 'login' },
      ]);
    }
    if (user.accountData.email === request.body.email) {
      throw new BadRequestException([
        { message: 'email is already used', field: 'email' },
      ]);
    }
  }
}
