import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Snippet } from '../../snippets/entities/snippet.entity';

@Entity()
export class Bookmark {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.bookmarks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Snippet, (snippet) => snippet.bookmarks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'snippet_id' })
    snippet: Snippet;

    @CreateDateColumn()
    bookmarkedAt: Date;
}
