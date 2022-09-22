import { Controller } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller()
export class CommentsController {
  constructor(protected commentsService: CommentsService) {}
}
