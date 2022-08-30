import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BloggersController } from './bloggers/bloggers.controller,ts';
import { BloggersService } from './bloggers/bloggers.service';
import { BloggersHelper } from './bloggers/bloggers.helper';
import { BloggersRepositories } from './bloggers/bloggers.repositories';

@Module({
  imports: [],
  controllers: [AppController, BloggersController],
  providers: [
    AppService,
    BloggersService,
    BloggersHelper,
    BloggersRepositories,
  ],
})
export class AppModule {}
