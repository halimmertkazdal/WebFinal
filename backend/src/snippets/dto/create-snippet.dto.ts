import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSnippetDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    codeContent: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    languageId: number;
}
