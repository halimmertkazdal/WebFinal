import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Language } from '../../languages/entities/language.entity';
import { Bookmark } from '../../bookmarks/entities/bookmark.entity';

@Entity()
export class Snippet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('text')
    codeContent: string;

    @Column({ nullable: true })
    description: string;

    @ManyToOne(() => Language, (language) => language.snippets, { eager: true, onDelete: 'SET NULL' })
    language: Language;

    @ManyToOne(() => User, (user) => user.snippets, { eager: true, onDelete: 'CASCADE' })
    user: User;

    @OneToMany(() => Bookmark, (bookmark) => bookmark.snippet)
    bookmarks: Bookmark[];

    @CreateDateColumn()
    createdAt: Date;
}
