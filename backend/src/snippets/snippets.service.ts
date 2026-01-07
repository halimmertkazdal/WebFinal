import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';
import { Snippet } from './entities/snippet.entity';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class SnippetsService {
  constructor(
    @InjectRepository(Snippet)
    private snippetRepository: Repository<Snippet>,
  ) { }

  async create(createSnippetDto: CreateSnippetDto, user: User) {
    const snippet = this.snippetRepository.create({
      ...createSnippetDto,
      language: { id: createSnippetDto.languageId },
      user,
    });
    return this.snippetRepository.save(snippet);
  }

  findAll() {
    return this.snippetRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    const snippet = await this.snippetRepository.findOne({
      where: { id },
      relations: ['language', 'user']
    });
    if (!snippet) throw new NotFoundException('Snippet not found');
    return snippet;
  }

  async update(id: number, updateSnippetDto: UpdateSnippetDto, user: User) {
    const snippet = await this.findOne(id);
    if (snippet.user.id !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only update your own snippets');
    }
    await this.snippetRepository.update(id, {
      ...updateSnippetDto,
      ...(updateSnippetDto.languageId && { language: { id: updateSnippetDto.languageId } }),
    });
    return this.findOne(id);
  }

  async remove(id: number, user: User) {
    const snippet = await this.findOne(id);
    if (snippet.user.id !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only delete your own snippets');
    }
    return this.snippetRepository.delete(id);
  }
}
