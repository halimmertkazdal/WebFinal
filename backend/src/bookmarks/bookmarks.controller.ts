import { Controller, Get, Post, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('bookmarks')
@UseGuards(AuthGuard('jwt'))
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) { }

  @Post(':snippetId')
  toggle(@Param('snippetId', ParseIntPipe) snippetId: number, @Request() req) {
    return this.bookmarksService.toggleBookmark(req.user, snippetId);
  }

  @Get()
  findAll(@Request() req) {
    return this.bookmarksService.findAllByUser(req.user);
  }
}
