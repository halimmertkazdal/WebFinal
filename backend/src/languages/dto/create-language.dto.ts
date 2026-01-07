import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class CreateLanguageDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^#([0-9A-F]{3}){1,2}$/i, { message: 'colorCode must be a valid hex color' })
    colorCode: string;
}
