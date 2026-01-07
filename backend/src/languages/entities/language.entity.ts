import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Snippet } from '../../snippets/entities/snippet.entity';

@Entity()
export class Language {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column()
    colorCode: string; // e.g., #FF5733

    @OneToMany(() => Snippet, (snippet) => snippet.language)
    snippets: Snippet[];
}
