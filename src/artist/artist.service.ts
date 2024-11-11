import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ArtistDto, CreateArtistDto } from './dto/artist.dto';
import { DatabaseService } from '../db/db.service';
import { v4, validate } from 'uuid';
import { TrackDto } from 'src/track/dto/track.dto';

@Injectable()
export class ArtistService {
  // private readonly artists: ArtistDto[] = [];
  // private artists = this.databaseService.getArtists();

  constructor(private readonly databaseService: DatabaseService) {}

  createArtist(newArtist: CreateArtistDto): ArtistDto {
    const artists = this.databaseService.getArtists();
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

    artists.push(artist);
    this.databaseService.updateArtists(artists);

    return artist;
  }

  getAllArtists(): ArtistDto[] {
    // return this.artists;
    return this.databaseService.getArtists();
  }

  getArtistById(searchId: string): ArtistDto | undefined {
    // проверка на валидность id артиста
    if (!validate(searchId))
      throw new HttpException('ArtistId is not uuid', HttpStatus.BAD_REQUEST);

    // поиск артиста
    const artists = this.databaseService.getArtists();
    const artist = artists.find((i) => i.id === searchId);
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
    const artists = this.databaseService.getArtists();
    const artist = artists.find((i) => i.id === searchId);
    if (!artist)
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);

    artist.name = newArtistData.name;
    artist.grammy = newArtistData.grammy;

    this.databaseService.updateArtists(artists);

    // return {
    //   id: artist.id,
    //   name: newArtistData.name,
    //   grammy: newArtistData.grammy,
    // };
    return artist;
  }

  deleteArtist(searchId: string): ArtistDto {
    // проверка на валидность id артиста
    if (!validate(searchId))
      throw new HttpException('ArtistId is not uuid', HttpStatus.BAD_REQUEST);

    // поиск артиста
    const artists = this.databaseService.getArtists();
    const deletedArtist = artists.find((i) => i.id === searchId);
    const indexArtist = artists.findIndex((i) => i.id === searchId);
    if (indexArtist === -1)
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);

    artists.splice(indexArtist, 1); // удалить из базы

    this.databaseService.updateArtists(artists);

    // удалить из фаворитов, альбомов и треков
    this.databaseService.updateFavoritesArtists('remove', searchId);

    const tracks: TrackDto[] = this.databaseService.getTracks();
    const track: TrackDto = tracks.find((i) => i.artistId === searchId);
    if (track) track.artistId = null;
    this.databaseService.updateTracks(tracks);

    const albums = this.databaseService.getAlbums();
    const album = albums.find((i) => i.artistId === searchId);
    if (album) album.artistId = null;
    this.databaseService.updateAlbums(albums);

    return deletedArtist;
  }
}
