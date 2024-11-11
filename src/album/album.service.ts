import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AlbumDto, CreateAlbumDto } from './dto/album.dto';
import { DatabaseService } from '../db/db.service';
import { v4, validate } from 'uuid';
import { TrackDto } from 'src/track/dto/track.dto';

@Injectable()
export class AlbumService {
  // private readonly albums: AlbumDto[] = [];
  // private albums = this.databaseService.getAlbums();

  constructor(private readonly databaseService: DatabaseService) {}

  createAlbum(newAlbum: CreateAlbumDto): AlbumDto {
    const albums = this.databaseService.getAlbums();
    if (
      typeof newAlbum.name !== 'string' ||
      typeof newAlbum.year !== 'number'
      // !validate(newAlbum.artistId)
    )
      throw new HttpException('Invalid initial data', HttpStatus.BAD_REQUEST);

    const album: AlbumDto = {
      id: v4(),
      name: newAlbum.name,
      year: newAlbum.year,
      artistId: newAlbum.artistId,
    };

    albums.push(album);
    this.databaseService.updateAlbums(albums);

    return album;
  }

  getAllAlbums(): AlbumDto[] {
    // return this.albums;
    return this.databaseService.getAlbums();
  }

  getAlbumById(searchId: string): AlbumDto | undefined {
    // проверка на валидность id альбома
    if (!validate(searchId))
      throw new HttpException('AlbumId is not uuid', HttpStatus.BAD_REQUEST);

    // поиск альбома
    const albums = this.databaseService.getAlbums();
    const album = albums.find((i) => i.id === searchId);
    if (!album)
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);

    return album;
  }

  updateAlbum(searchId: string, newAlbumData: CreateAlbumDto): AlbumDto {
    // проверка на пустой dto
    if (Object.keys(newAlbumData).length == 0)
      throw new HttpException('Invalid dto', HttpStatus.BAD_REQUEST);

    // проверка на валидность id трека
    if (!validate(searchId))
      throw new HttpException('AlbumId is not uuid', HttpStatus.BAD_REQUEST);

    if (
      typeof newAlbumData.name !== 'string' ||
      typeof newAlbumData.year !== 'number'
      // !validate(newAlbumData.artistId)
    )
      throw new HttpException('Invalid initial data', HttpStatus.BAD_REQUEST);

    // поиск трека
    const albums = this.databaseService.getAlbums();
    const album = albums.find((i) => i.id === searchId);
    if (!album)
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);

    album.name = newAlbumData.name;
    album.artistId = newAlbumData.artistId;
    album.year = newAlbumData.year;

    this.databaseService.updateAlbums(albums);

    // return {
    //   id: album.id,
    //   name: newAlbumData.name,
    //   artistId: newAlbumData.artistId,
    //   year: newAlbumData.year,
    // };
    return album;
  }

  deleteAlbum(searchId: string): AlbumDto {
    // проверка на валидность id альбома
    if (!validate(searchId))
      throw new HttpException('AlbumId is not uuid', HttpStatus.BAD_REQUEST);

    // поиск альбома
    const albums = this.databaseService.getAlbums();
    const deletedAlbum = albums.find((i) => i.id === searchId);
    const indexAlbum = albums.findIndex((i) => i.id === searchId);
    if (indexAlbum === -1)
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);

    // удалить из фаворитов и треков
    this.databaseService.updateFavoritesAlbums('remove', deletedAlbum);

    const tracks: TrackDto[] = this.databaseService.getTracks();
    const track = tracks.find((i) => i.albumId === searchId);
    if (track) track.albumId = null;
    this.databaseService.updateTracks(tracks);

    // удалить из базы
    albums.splice(indexAlbum, 1);
    this.databaseService.updateAlbums(albums);

    return deletedAlbum;
  }
}
