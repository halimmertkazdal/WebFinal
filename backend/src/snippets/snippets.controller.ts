import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { SnippetsService } from './snippets.service';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('snippets')
export class SnippetsController {
  constructor(private readonly snippetsService: SnippetsService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createSnippetDto: CreateSnippetDto, @Request() req) {
    return this.snippetsService.create(createSnippetDto, req.user);
  }

  @Get()
  findAll() {
    return this.snippetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.snippetsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateSnippetDto: UpdateSnippetDto, @Request() req) {
    return this.snippetsService.update(+id, updateSnippetDto, req.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @Request() req) {
    return this.snippetsService.remove(+id, req.user);
  }
}
