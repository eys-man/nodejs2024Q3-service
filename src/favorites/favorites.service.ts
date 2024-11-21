import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FavoritesDto } from './dto/favorites.dto';
import { validate } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorites } from './entity/favorites.entity';
import { Repository } from 'typeorm';
import { Track } from 'src/track/entity/track.entity';
import { Album } from 'src/album/entity/album.entity';
import { Artist } from 'src/artist/entity/artist.entity';
import { ArtistService } from 'src/artist/artist.service';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class FavoritesService {
  artistService: ArtistService;
  albumService: AlbumService;
  tracksService: TrackService;
  constructor(
    @InjectRepository(Favorites) private favsRepo: Repository<Favorites>,
  ) {}

  async getAllFavorites(): Promise<FavoritesDto> {
    const favs = await this.favsRepo.find();
    const artists = favs[0].artists;
    const albums = favs[0].albums;
    const tracks = favs[0].tracks;

    const a: FavoritesDto = {
      artists,
      albums,
      tracks,     
    }
    
    return a;
  }

async addTrack(trackId: string) {
    // проверка на валидность id трека
    if (!validate(trackId))
      throw new HttpException('TrackId is not uuid', HttpStatus.BAD_REQUEST);

    // найти среди всех треков в базе этот трек
    const track = await this.tracksService.getTrackById(trackId);

    // если трека в базе нет
    if (!track) {
      throw new HttpException(
        'TrackId was not found in database',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const favs = await this.getAllFavorites();
    favs.tracks.push(track);
 
    // добавить в БД в favorites
    await this.favsRepo.save(favs);

    return track;
  }

  async addAlbum(albumId: string) {
    // проверка на валидность id альбома
    if (!validate(albumId))
      throw new HttpException('AlbumId is not uuid', HttpStatus.BAD_REQUEST);

    // найти среди всех альбомов в базе этот трек
    const album = await this.albumService.getAlbumById(albumId);

    // если альбома в базе нет
    if (!album) {
      throw new HttpException(
        'AlbumId was not found in database',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const favs = await this.getAllFavorites();
    favs.albums.push(album);
    // добавить в БД в favorites

    await this.favsRepo.save(favs);

    return album;
  }

  async addArtist(artistId: string) {
    // проверка на валидность id артиста
    if (!validate(artistId)) {
      throw new HttpException('ArtistId is not uuid', HttpStatus.BAD_REQUEST);
    }

    // найти среди всех артистов в базе этого артиста
    const artist = await this.artistService.getArtistById(artistId);

    // если артиста в базе нет
    if (!artist) {
      throw new HttpException(
        'ArtistId was not found in database',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const favs = await this.getAllFavorites();
    favs.artists.push(artist);
    // добавить в БД в favorites

    await this.favsRepo.save(favs);

    return artist;
  }

  async removeArtist(artistId: string) {
    // проверка на валидность id артиста
    if (!validate(artistId))
      throw new HttpException('ArtistId is not uuid', HttpStatus.BAD_REQUEST);

    // найти среди всех артистов в базе этого артиста
    const artist = await this.artistService.getArtistById(artistId);

    // если артиста в базе нет
    if (!artist) {
      throw new HttpException(
        'ArtistId was not found in database',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // удалить из списка фаворитов этого артиста
    const favs = await this.getAllFavorites();

    const index = favs.artists.findIndex((i) => i.id === artist.id);
    if (index !== -1){
      favs.artists.splice(index, 1);
    }

    await this.favsRepo.save(favs);

    return artist;
  }

  async removeAlbum(albumId: string) {
    // проверка на валидность id альбома
    if (!validate(albumId))
      throw new HttpException('albumId is not uuid', HttpStatus.BAD_REQUEST);

    // найти среди всех альбомов в базе этот альбом
    const album = await this.albumService.getAlbumById(albumId);

    // если альбома в базе нет
    if (!album) {
      throw new HttpException(
        'albumId was not found in database',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // удалить из фаворитов этот альбом
    const favs = await this.getAllFavorites();

    const index = favs.albums.findIndex((i) => i.id === album.id);
    if (index !== -1){
      favs.albums.splice(index, 1);
    }

    await this.favsRepo.save(favs);

    return album;
  }

  async removeTrack(trackId: string) {
    // проверка на валидность id трека
    if (!validate(trackId))
      throw new HttpException('trackId is not uuid', HttpStatus.BAD_REQUEST);

    // найти среди всех треков в базе этот трек
    const track = await this.albumService.getAlbumById(trackId);

    // если трека в базе нет
    if (!track) {
      throw new HttpException(
        'trackId was not found in database',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // удалить из фаворитов этот трек
    const favs = await this.getAllFavorites();

    const index = favs.tracks.findIndex((i) => i.id === track.id);
    if (index !== -1){
      favs.albums.splice(index, 1);
    }

    await this.favsRepo.save(favs);

    return track;
  }
}
