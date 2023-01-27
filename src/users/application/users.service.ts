import { Injectable } from "@nestjs/common";
import { UsersRepositories } from "../infrastructure/users.repositories";
import { ObjectId } from "mongodb";

@Injectable()
export class UsersService {
  constructor(protected usersRepositories: UsersRepositories) {}

  async deleteUsers(id: ObjectId): Promise<boolean> {
    return this.usersRepositories.deleteUser(id);
  }
}
