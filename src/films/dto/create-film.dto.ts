import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateFilmDto {
  @IsString()
  @IsNotEmpty()
  judul: string;

  @IsString()
  @IsNotEmpty()
  genre: string;

  @IsInt()
  @Min(1900)
  @Max(2030)
  tahun: number;

  @IsInt()  
  @Min(0)
  @Max(10)
  rating: number;

  @IsBoolean()
  @IsOptional()
  sudahDitonton?: boolean;
}
