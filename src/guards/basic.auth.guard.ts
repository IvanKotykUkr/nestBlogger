import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from "express";

@Injectable()
export class BasicAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const b64auth = (request.headers.authorization || "").split(" ")[1] || "";
    const [username, password] = Buffer.from(b64auth, "base64")
      .toString()
      .split(":");
    if (
      b64auth === undefined ||
      username !== process.env.USERNAME ||
      password !== process.env.PASSWORD
    ) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
