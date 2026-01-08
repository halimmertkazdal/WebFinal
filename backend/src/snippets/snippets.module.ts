import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from '../languages/entities/language.entity';
import { SnippetsService } from './snippets.service';
import { SnippetsController } from './snippets.controller';
import { Snippet } from './entities/snippet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Snippet, Language])],
  controllers: [SnippetsController],
  providers: [SnippetsService],
})
export class SnippetsModule { }
