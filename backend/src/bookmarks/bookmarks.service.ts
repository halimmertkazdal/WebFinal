import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarkRepository: Repository<Bookmark>,
  ) { }

  async toggleBookmark(user: User, snippetId: number) {
    const existing = await this.bookmarkRepository.findOne({
      where: { user: { id: user.id }, snippet: { id: snippetId } },
    });

    if (existing) {
      await this.bookmarkRepository.remove(existing);
      return { message: 'Bookmark removed', bookmarked: false };
    } else {
      const bookmark = this.bookmarkRepository.create({
        user,
        snippet: { id: snippetId },
      });
      await this.bookmarkRepository.save(bookmark);
      return { message: 'Bookmark added', bookmarked: true };
    }
  }

  findAllByUser(user: User) {
    return this.bookmarkRepository.find({
      where: { user: { id: user.id } },
      relations: ['snippet', 'snippet.language', 'snippet.user'],
    });
  }
}
