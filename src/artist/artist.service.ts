import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/artist.dto';
import { Artist } from './entity/artist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate } from 'uuid';
import { FavoritesService } from 'src/favorites/favorites.service';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';
import { CreateTrackDto } from 'src/track/dto/track.dto';
import { CreateAlbumDto } from 'src/album/dto/album.dto';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist) private artistsRepo: Repository<Artist>,
    private favsService: FavoritesService,
    private albumService: AlbumService,
    private trackService: TrackService,
  ) {}

  async createArtist(newArtist: CreateArtistDto): Promise<CreateArtistDto> {
    if (
      typeof newArtist.name !== 'string' ||
      typeof newArtist.grammy !== 'boolean'
    )
      throw new HttpException('Invalid initial data', HttpStatus.BAD_REQUEST);

    await this.artistsRepo.save(newArtist);

    return newArtist;
  }

  async getAllArtists(): Promise<Artist[]> {
    return await this.artistsRepo.find();
  }

  async getArtistById(searchId: string): Promise<Artist> {
    // проверка на валидность id артиста
    if (!validate(searchId))
      throw new HttpException('ArtistId is not uuid', HttpStatus.BAD_REQUEST);

    // поиск артиста
    const artist = this.artistsRepo.findOne({ where: { id: searchId } });
    if (!artist)
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);

    return artist;
  }

  async updateArtist(
    searchId: string,
    newArtistData: CreateArtistDto,
  ): Promise<Artist> {
    // проверка на пустой dto
    if (Object.keys(newArtistData).length == 0)
      throw new HttpException('Invalid dto', HttpStatus.BAD_REQUEST);

    // проверка на валидность id трека
    if (!validate(searchId))
      throw new HttpException('ArtistId is not uuid', HttpStatus.BAD_REQUEST);

    if (
      typeof newArtistData.name !== 'string' ||
      typeof newArtistData.grammy !== 'boolean'
    )
      throw new HttpException('Invalid initial data', HttpStatus.BAD_REQUEST);

    // поиск артиста
    const artist = await this.getArtistById(searchId);
    if (!artist)
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);

    artist.name = newArtistData.name;
    artist.grammy = newArtistData.grammy;

    await this.artistsRepo.save(artist);

    return artist;
  }

  async deleteArtist(searchId: string): Promise<CreateArtistDto> {
    // проверка на валидность id артиста
    if (!validate(searchId))
      throw new HttpException('ArtistId is not uuid', HttpStatus.BAD_REQUEST);

    // поиск артиста
    const artist = await this.getArtistById(searchId);
    if (!artist)
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);

    // удалить из фаворитов
    this.favsService.removeArtist(searchId);

    // удалить из треков и альбомов
    const track = await this.trackService.getTrackByArtistId(searchId);
    track.artistId = null;
    const updTrack: CreateTrackDto = { ...track };
    this.trackService.updateTrack(track.id, updTrack);

    const album = await this.albumService.getAlbumByArtistId(searchId);
    track.artistId = null;
    const updAlbum: CreateAlbumDto = { ...album };
    this.albumService.updateAlbum(album.id, updAlbum);

    // удалить из базы
    await this.artistsRepo.delete({ id: searchId });

    return artist;
  }
}
