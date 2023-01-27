import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ObjectId } from "mongodb";
import { LikeDbType } from "../../comments.types";
import { LikesRepositories } from "../../infrastructure/likes.repositories";
import { LikesDocument } from "../../infrastructure/repository/likes.mongooose.schema";

export class UpdateLikeCommand {
  constructor(
    public entityId: ObjectId,
    public likeStatus: string,
    public userId: ObjectId,
    public login: string
  ) {}
}

@CommandHandler(UpdateLikeCommand)
export class UpdateLikeUseCase implements ICommandHandler<UpdateLikeCommand> {
  constructor(protected likesRepositories: LikesRepositories) {}

  async execute(command: UpdateLikeCommand) {
    const checkStatus = await this.likesRepositories.findStatus(
      command.userId,
      command.entityId
    );

    if (typeof checkStatus !== "boolean") {
      return this.compareStatus(checkStatus, command.likeStatus);
    }
    const likeDTO = this.createLikeDTO(
      command.entityId,
      command.likeStatus,
      command.userId,
      command.login
    );
    return this.likesRepositories.createStatus(likeDTO);
  }

  private createLikeDTO(
    entityId: ObjectId,
    status: string,
    userId: ObjectId,
    login: string
  ): LikeDbType {
    return {
      _id: new ObjectId(),
      entityId,
      status,
      userId,
      login,
      addedAt: new Date(),
    };
  }

  private async compareStatus(like: LikesDocument, status: string) {
    if (status === "None") {
      return this.likesRepositories.deleteStatus(like);
    }
    if (like.status.toString() === status) return;

    like.status = status;
    return this.likesRepositories.save(like);
  }
}
