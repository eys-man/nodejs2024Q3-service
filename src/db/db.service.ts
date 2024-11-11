import { Injectable } from '@nestjs/common';
import { UserDto } from '../user/dto/users.dto';
import { ArtistDto } from '../artist/dto/artist.dto';
import { TrackDto } from '../track/dto/track.dto';
import { AlbumDto } from '../album/dto/album.dto';
import { FavoritesDto } from '../favorites/dto/favorites.dto';

@Injectable()
export class DatabaseService {
  private users: UserDto[] = [];
  private artists: ArtistDto[] = [];
  private tracks: TrackDto[] = [];
  private albums: AlbumDto[] = [];
  private favorites: FavoritesDto = {
    artists: [],
    albums: [],
    tracks: [],
  };

  getUsers() {
    return this.users;
  }

  updateUsers(users: UserDto[]) {
    this.users = structuredClone(users);
    // this.users = [...users];
  }

  getArtists() {
    return this.artists;
  }

  updateArtists(artists: ArtistDto[]) {
    this.artists = structuredClone(artists);
    // this.artists = [...artists];
  }

  getTracks() {
    return this.tracks;
  }

  updateTracks(tracks: TrackDto[]) {
    this.tracks = structuredClone(tracks);
    // this.tracks = [...tracks];
  }

  getAlbums() {
    return this.albums;
  }

  updateAlbums(albums: AlbumDto[]) {
    this.albums = structuredClone(albums);
    // this.albums = [...albums];
  }

  getFavorites() {
    return this.favorites;
  }

  updateFavoritesArtists(action: 'add' | 'remove', artistId: string) {
    if (action === 'add') this.favorites.artists.push(artistId);
    else {
      const index = this.favorites.artists.findIndex((i) => i === artistId);
      this.favorites.artists.splice(index, 1);
    }
  }

  updateFavoritesAlbums(action: 'add' | 'remove', albumId: string) {
    if (action === 'add') this.favorites.albums.push(albumId);
    else {
      const index = this.favorites.albums.findIndex((i) => i === albumId);
      this.favorites.albums.splice(index, 1);
    }
  }

  updateFavoritesTracks(action: 'add' | 'remove', trackId: string) {
    if (action === 'add') this.favorites.tracks.push(trackId);
    else {
      const index = this.favorites.tracks.findIndex((i) => i === trackId);
      this.favorites.tracks.splice(index, 1);
    }
  }
}
