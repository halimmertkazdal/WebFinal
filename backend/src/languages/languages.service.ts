import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { Language } from './entities/language.entity';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
  ) { }

  async create(createLanguageDto: CreateLanguageDto) {
    const existing = await this.languageRepository.findOneBy({ name: createLanguageDto.name });
    if (existing) throw new ConflictException('Language already exists');

    const language = this.languageRepository.create(createLanguageDto);
    return this.languageRepository.save(language);
  }

  findAll() {
    return this.languageRepository.find();
  }

  findOne(id: number) {
    return this.languageRepository.findOneBy({ id });
  }

  update(id: number, updateLanguageDto: UpdateLanguageDto) {
    return this.languageRepository.update(id, updateLanguageDto);
  }

  remove(id: number) {
    return this.languageRepository.delete(id);
  }
}
