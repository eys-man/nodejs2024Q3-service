import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AlbumDto, CreateAlbumDto } from './dto/album.dto';
import { DatabaseService } from '../db/db.service';
import { v4, validate } from 'uuid';

@Injectable()
export class AlbumService {
  // private readonly albums: AlbumDto[] = [];
  private albums = this.databaseService.getAlbums();

  constructor(private readonly databaseService: DatabaseService) {}

  createAlbum(newAlbum: CreateAlbumDto): AlbumDto {
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

    this.albums.push(album);

    return album;
  }

  getAllAlbums(): AlbumDto[] {
    return this.albums;
  }

  getAlbumById(searchId: string): AlbumDto | undefined {
    // проверка на валидность id трека
    if (!validate(searchId))
      throw new HttpException('AlbumId is not uuid', HttpStatus.BAD_REQUEST);

    // поиск трека
    const album = this.albums.find((i) => i.id === searchId);
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
    const album = this.albums.find((i) => i.id === searchId);
    if (!album)
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);

    return {
      id: album.id,
      name: newAlbumData.name,
      artistId: newAlbumData.artistId,
      year: newAlbumData.year,
    };
  }

  deleteAlbum(searchId: string): AlbumDto {
    // проверка на валидность id трека
    if (!validate(searchId))
      throw new HttpException('AlbumId is not uuid', HttpStatus.BAD_REQUEST);

    // поиск трека
    const deletedAlbum = this.albums.find((i) => i.id === searchId);
    const indexAlbum = this.albums.findIndex((i) => i.id === searchId);
    if (indexAlbum === -1)
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);

    this.albums.splice(indexAlbum, 1); // удалить из базы

    return deletedAlbum;
  }
}
