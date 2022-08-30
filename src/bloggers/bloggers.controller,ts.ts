import { Controller, Get, Param } from '@nestjs/common';

@Controller('/bloggers')
export class BloggersController {
  @Get()
  getBloggers() {
    return ['2'];
  }

  @Get(':id')
  getBlogger(@Param('id') id: string) {
    return '4';
  }
}
