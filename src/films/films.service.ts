import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';

@Injectable()
export class FilmsService {
  private films: any[] = [];

  constructor() {
    this.loadFilms();
  }

  private loadFilms() {
    try {
      const filePath = path.join(process.cwd(), 'src', 'films.json');
      const fileData = fs.readFileSync(filePath, 'utf8');
      this.films = JSON.parse(fileData);
      console.log('Data film berhasil dimuat:', this.films.length, 'film');
    } catch (error) {
      console.error('Gagal memuat films.json:', error);
      this.films = [];
    }
  }

  findAll(ditonton?: string) {
    if (ditonton !== undefined) {
      const isWatched = ditonton === 'true';
      return this.films.filter((film) => film.sudahDitonton === isWatched);
    }
    return this.films;
  }

  findOne(id: string) {
    const film = this.films.find((f) => f.id === id);
    if (!film) {
      throw new NotFoundException(`Film dengan ID ${id} tidak ditemukan.`);
    }
    return film;
  }

  create(createFilmDto: CreateFilmDto) {
    const newId = (
      this.films.length > 0
        ? Math.max(...this.films.map((f) => Number(f.id) || 0)) + 1
        : 1
    ).toString();
    const newFilm = {
      id: newId,
      ...createFilmDto,
      sudahDitonton: createFilmDto.sudahDitonton ?? false,
    };
    this.films.push(newFilm);
    return newFilm;
  }

  update(id: string, updateFilmDto: UpdateFilmDto) {
    const film = this.findOne(id);
    const index = this.films.findIndex((f) => f.id === id);

    this.films[index] = {
      ...film,
      ...updateFilmDto,
    };

    return this.films[index];
  }

  remove(id: string) {
    this.findOne(id); // Memastikan film ada, jika tidak melempar 404
    this.films = this.films.filter((f) => f.id !== id);
    return { message: `Film dengan ID ${id} berhasil dihapus.` };
  }
}
