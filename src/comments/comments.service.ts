import { CommentsHelper } from './comments.helper';
import { CommentsRepositories } from './comments.repositories';

export class CommentsService {
  constructor(
    protected commentsHelper: CommentsHelper,
    protected commentsRepositories: CommentsRepositories,
  ) {}
}
