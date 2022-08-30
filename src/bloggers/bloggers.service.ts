import { BloggersHelper } from './bloggers.helper';

export class BloggersService {
  constructor(protected BloggersHelper: BloggersHelper) {}

  async getBlogger() {
    const blogger = await this.BloggersHelper.findBlogger();
  }
}
