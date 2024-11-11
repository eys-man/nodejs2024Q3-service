import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FavoritesDto } from './dto/favorites.dto';
import { DatabaseService } from '../db/db.service';
import { validate } from 'uuid';

@Injectable()
export class FavoritesService {
  // private favorites = this.databaseService.getFavorites();

  constructor(private readonly databaseService: DatabaseService) {}

  getAllFavorites(): FavoritesDto {
    return this.databaseService.getFavorites();
    // return this.favorites;
  }

  addTrack(trackId: string) {
    // проверка на валидность id трека
    if (!validate(trackId))
      throw new HttpException('TrackId is not uuid', HttpStatus.BAD_REQUEST);

    // найти среди всех треков в базе этот трек
    const tracks = this.databaseService.getTracks();
    const track = tracks.find((i) => i.id === trackId);

    // если трека в базе нет
    if (!track) {
      throw new HttpException(
        'TrackId was not found in database',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // добавить в БД в favorites
    this.databaseService.updateFavoritesTracks('add', track);

    return track;
  }

  addAlbum(albumId: string) {
    // проверка на валидность id альбома
    if (!validate(albumId))
      throw new HttpException('AlbumId is not uuid', HttpStatus.BAD_REQUEST);

    // найти среди всех альбомов в базе этот альбом
    const albums = this.databaseService.getAlbums();
    const album = albums.find((i) => i.id === albumId);

    // если альбома в базе нет
    if (!album) {
      throw new HttpException(
        'AlbumId was not found in database',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // добавить в БД в favorites
    this.databaseService.updateFavoritesAlbums('add', album);

    return album;
  }

  addArtist(artistId: string) {
    // проверка на валидность id артиста
    if (!validate(artistId)) {
      throw new HttpException('ArtistId is not uuid', HttpStatus.BAD_REQUEST);
    }

    // найти среди всех артистов в базе этого артиста
    const artists = this.databaseService.getArtists();
    const artist = artists.find((i) => i.id === artistId);

    // если артиста в базе нет
    if (!artist) {
      throw new HttpException(
        'ArtistId was not found in database',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // добавить в БД в favorites
    this.databaseService.updateFavoritesArtists('add', artist);

    return artist;
  }

  removeArtist(artistId: string) {
    // проверка на валидность id артиста
    if (!validate(artistId))
      throw new HttpException('ArtistId is not uuid', HttpStatus.BAD_REQUEST);

    // найти среди всех артистов в базе этого артиста
    const artist = this.databaseService
      .getArtists()
      .find((i) => i.id === artistId);

    // если артиста в базе нет
    if (!artist) {
      throw new HttpException(
        'ArtistId was not found in database',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // удалить из фаворитов этого артиста
    this.databaseService.updateFavoritesArtists('remove', artist);

    return artist;
  }

  removeAlbum(albumId: string) {
    // проверка на валидность id альбома
    if (!validate(albumId))
      throw new HttpException('albumId is not uuid', HttpStatus.BAD_REQUEST);

    // найти среди всех альбомов в базе этот альбом
    const album = this.databaseService
      .getAlbums()
      .find((i) => i.id === albumId);

    // если альбома в базе нет
    if (!album) {
      throw new HttpException(
        'albumId was not found in database',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // удалить из фаворитов этот альбом
    this.databaseService.updateFavoritesAlbums('remove', album);

    return album;
  }

  removeTrack(trackId: string) {
    // проверка на валидность id трека
    if (!validate(trackId))
      throw new HttpException('trackId is not uuid', HttpStatus.BAD_REQUEST);

    // найти среди всех треков в базе этот трек
    const track = this.databaseService
      .getTracks()
      .find((i) => i.id === trackId);

    // если трека в базе нет
    if (!track) {
      throw new HttpException(
        'trackId was not found in database',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // удалить из фаворитов этот трек
    this.databaseService.updateFavoritesTracks('remove', track);

    return track;
  }
}
