import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/album.dto';
import { validate } from 'uuid';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from './entity/album.entity';
import { FavoritesService } from 'src/favorites/favorites.service';
import { TrackService } from 'src/track/track.service';
import { CreateTrackDto } from 'src/track/dto/track.dto';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album) private albumsRepo: Repository<Album>,
    private favsService: FavoritesService,
    private trackService: TrackService,
  ) {}

  async createAlbum(newAlbum: CreateAlbumDto): Promise<CreateAlbumDto> {
    if (
      typeof newAlbum.name !== 'string' ||
      typeof newAlbum.year !== 'number'
      // !validate(newAlbum.artistId)
    )
      throw new HttpException('Invalid initial data', HttpStatus.BAD_REQUEST);

    await this.albumsRepo.save(newAlbum);

    return newAlbum;
  }

  async getAllAlbums(): Promise<Album[]> {
    // return this.albums;
    return await this.albumsRepo.find();
  }

  async getAlbumById(searchId: string): Promise<Album> {
    // проверка на валидность id альбома
    if (!validate(searchId))
      throw new HttpException('AlbumId is not uuid', HttpStatus.BAD_REQUEST);

    // поиск альбома
    const album = this.albumsRepo.findOne({ where: { id: searchId } });
    if (!album)
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);

    return album;
  }

  async getAlbumByArtistId(searchId: string): Promise<Album> {
    // проверка на валидность id альбома
    if (!validate(searchId))
      throw new HttpException('AlbumId is not uuid', HttpStatus.BAD_REQUEST);

    // поиск альбома
    const album = this.albumsRepo.findOne({ where: { artistId: searchId } });
    if (!album)
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);

    return album;
  }

  async updateAlbum(
    searchId: string,
    newAlbumData: CreateAlbumDto,
  ): Promise<Album> {
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

    // поиск альбома
    const album = await this.getAlbumById(searchId);
    if (!album)
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);

    album.name = newAlbumData.name;
    album.artistId = newAlbumData.artistId;
    album.year = newAlbumData.year;

    await this.albumsRepo.save(album);

    return album;
  }

  async deleteAlbum(searchId: string): Promise<CreateAlbumDto> {
    // проверка на валидность id альбома
    if (!validate(searchId))
      throw new HttpException('AlbumId is not uuid', HttpStatus.BAD_REQUEST);

    // поиск альбома
    const album = await this.getAlbumById(searchId);
    if (!album)
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);

    // удалить из фаворитов
    this.favsService.removeAlbum(searchId);

    // удалить из треков
    const track = await this.trackService.getTrackByAlbumId(searchId);
    track.albumId = null;
    const updTrack: CreateTrackDto = { ...track };
    this.trackService.updateTrack(track.id, updTrack);

    // удалить из базы
    await this.albumsRepo.delete({ id: searchId });

    return album;
  }
}
