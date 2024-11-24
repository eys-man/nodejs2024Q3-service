import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FavoritesDto } from './dto/favorites.dto';
import { validate } from 'uuid';
import { ArtistService } from 'src/artist/artist.service';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class FavoritesService {
  constructor(
    private artistsService: ArtistService,
    private albumsService: AlbumService,
    private tracksService: TrackService,
  ) {}

  async getAllFavorites(): Promise<FavoritesDto> {
    const albums = await this.albumsService.getFavoritesAlbums();
    const artists = await this.artistsService.getFavoritesArtists();
    const tracks = await this.tracksService.getFavoritesTracks();

    return { albums, artists, tracks, };
  }

  async addTrack(trackId: string) {
    // проверка на валидность id трека
    if (!validate(trackId))
      throw new HttpException('TrackId is not uuid', HttpStatus.BAD_REQUEST);

    return await this.tracksService.addTrackToFavorites(trackId);
  }

  async addAlbum(albumId: string) {
    // проверка на валидность id альбома
    if (!validate(albumId))
      throw new HttpException('AlbumId is not uuid', HttpStatus.BAD_REQUEST);

    return await this.albumsService.addAlbumToFavorites(albumId);
  }

  async addArtist(artistId: string) {
    // проверка на валидность id артиста
    if (!validate(artistId)) {
      throw new HttpException('ArtistId is not uuid', HttpStatus.BAD_REQUEST);
    }

    return await this.artistsService.addArtistToFavorites(artistId);
  }

  async removeArtist(artistId: string) {
    // проверка на валидность id артиста
    if (!validate(artistId))
      throw new HttpException('ArtistId is not uuid', HttpStatus.BAD_REQUEST);

    return await this.artistsService.delArtistFromFavorites(artistId);
  }

  async removeAlbum(albumId: string) {
    // проверка на валидность id альбома
    if (!validate(albumId))
      throw new HttpException('albumId is not uuid', HttpStatus.BAD_REQUEST);

    return await this.albumsService.delAlbumFromFavorites(albumId);
  }

  async removeTrack(trackId: string) {
    // проверка на валидность id трека
    if (!validate(trackId))
      throw new HttpException('trackId is not uuid', HttpStatus.BAD_REQUEST);

    return await this.tracksService.delTrackFromFavorites(trackId);
  }
}
