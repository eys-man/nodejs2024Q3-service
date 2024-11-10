import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ArtistDto, CreateArtistDto } from './dto/artist.dto';
import { DatabaseService } from '../db/db.service';
import { v4, validate } from 'uuid';

@Injectable()
export class ArtistService {
  // private readonly artists: ArtistDto[] = [];
  private artists = this.databaseService.getArtists();

  constructor(private readonly databaseService: DatabaseService) {}

  createArtist(newArtist: CreateArtistDto): ArtistDto {
    if (
      typeof newArtist.name !== 'string' ||
      typeof newArtist.grammy !== 'boolean'
    )
      throw new HttpException('Invalid initial data', HttpStatus.BAD_REQUEST);

    const artist: ArtistDto = {
      id: v4(),
      name: newArtist.name,
      grammy: newArtist.grammy,
    };

    this.artists.push(artist);

    return artist;
  }

  getAllArtists(): ArtistDto[] {
    return this.artists;
  }

  getArtistById(searchId: string): ArtistDto | undefined {
    // проверка на валидность id артиста
    if (!validate(searchId))
      throw new HttpException('ArtistId is not uuid', HttpStatus.BAD_REQUEST);

    // поиск артиста
    const artist = this.artists.find((i) => i.id === searchId);
    if (!artist)
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);

    return artist;
  }

  updateArtist(searchId: string, newArtistData: CreateArtistDto): ArtistDto {
    // проверка на пустой dto
    if (Object.keys(newArtistData).length == 0)
      throw new HttpException('Invalid dto', HttpStatus.BAD_REQUEST);

    // проверка на валидность id артиста
    if (!validate(searchId))
      throw new HttpException('ArtistId is not uuid', HttpStatus.BAD_REQUEST);

    if (
      typeof newArtistData.name != 'string' ||
      typeof newArtistData.grammy != 'boolean'
    )
      throw new HttpException('Invalid input data', HttpStatus.BAD_REQUEST);

    // поиск артиста
    const artist = this.artists.find((i) => i.id === searchId);
    if (!artist)
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);

    return {
      id: artist.id,
      name: newArtistData.name,
      grammy: newArtistData.grammy,
    };
  }

  deleteArtist(searchId: string): ArtistDto {
    // проверка на валидность id артиста
    if (!validate(searchId))
      throw new HttpException('ArtistId is not uuid', HttpStatus.BAD_REQUEST);

    // поиск артиста
    const deletedArtist = this.artists.find((i) => i.id === searchId);
    const indexArtist = this.artists.findIndex((i) => i.id === searchId);
    if (indexArtist === -1)
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);

    this.artists.splice(indexArtist, 1); // удалить из базы

    return deletedArtist;
  }
}
