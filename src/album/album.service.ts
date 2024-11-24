import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/album.dto';
import { validate } from 'uuid';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from './entity/album.entity';


@Injectable()
export class AlbumService {
  constructor(@InjectRepository(Album) private albumsRepo: Repository<Album>) {}

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
    return await this.albumsRepo.find();
  }

  async getFavAlbums(): Promise<Album[]> {
    const albums = await this.getAllAlbums();
    return albums.filter(i => i.isFavorite);
  }

  async getAlbumById(searchId: string): Promise<Album> {
    // проверка на валидность id альбома
    if (!validate(searchId))
      throw new HttpException('AlbumId is not uuid', HttpStatus.BAD_REQUEST);

    // поиск альбома
    const album = await this.albumsRepo.findOneBy({id:searchId});
    if (!album)
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);

    return album;
  }

  async getFavoritesAlbums(): Promise<Album[]> {
    return await this.albumsRepo.find({
      where: { isFavorite: true },
      select: ['id', 'name', 'year', 'artistId'],
    });
  }

  async addAlbumToFavorites(newAlbum: string) {
    const album = await this.albumsRepo.findOneBy({ id: newAlbum });
    if (!album)
      throw new HttpException('Album not exists', HttpStatus.UNPROCESSABLE_ENTITY);

    album.isFavorite = true;
    return await this.albumsRepo.save(album);
    
    // const addedAlbum = await this.albumsRepo.save(album);

    // return {
    //   id: addedAlbum.id,
    //   name: addedAlbum.name,
    //   year: addedAlbum.year,
    //   artistId: addedAlbum.artistId,
    // };
  }

  async delAlbumFromFavorites(delAlbum: string): Promise<Album> {
    const album = await this.getAlbumById(delAlbum);
    album.isFavorite = false;
    await this.albumsRepo.save(album);

    return album;
  }

  async updateAlbum(searchId: string, newAlbumData: CreateAlbumDto): Promise<Album> {
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

    // return this.albumsRepo.save({ ...album, ...newAlbumData });
  }

  async deleteAlbum(searchId: string): Promise<CreateAlbumDto> {
    // проверка на валидность id альбома
    if (!validate(searchId))
      throw new HttpException('AlbumId is not uuid', HttpStatus.BAD_REQUEST);

    // поиск альбома
    const album = await this.getAlbumById(searchId);
    if (!album)
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);

    // удалить из базы
    await this.albumsRepo.delete({ id: searchId });

    return album;
  }
}
