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
  }

  getArtists() {
    return this.artists;
  }

  updateArtists(artists: ArtistDto[]) {
    this.artists = structuredClone(artists);
  }

  getTracks() {
    return this.tracks;
  }

  updateTracks(tracks: TrackDto[]) {
    this.tracks = structuredClone(tracks);
  }

  getAlbums() {
    return this.albums;
  }

  updateAlbums(albums: AlbumDto[]) {
    this.albums = structuredClone(albums);
  }

  getFavorites() {
    return this.favorites;
  }

  updateFavoritesArtists(action: 'add' | 'remove', updArtist: ArtistDto) {
    // найти в базе этого артиста
    const index = this.favorites.artists.findIndex(
      (i) => i.id === updArtist.id,
    );
    if (index !== -1) {
      if (action === 'remove') {
        this.favorites.artists.splice(index, 1);
      }
    } else {
      if (action === 'add') this.favorites.artists.push(updArtist);
    }
  }

  updateFavoritesAlbums(action: 'add' | 'remove', updAlbum: AlbumDto) {
    // найти в базе этот альбом
    const index = this.favorites.albums.findIndex((i) => i.id === updAlbum.id);
    if (index !== -1) {
      if (action === 'remove') {
        this.favorites.albums.splice(index, 1);
      }
    } else {
      if (action === 'add') this.favorites.albums.push(updAlbum);
    }
  }

  updateFavoritesTracks(action: 'add' | 'remove', updTrack: TrackDto) {
    // найти в базе этот альбом
    const index = this.favorites.tracks.findIndex((i) => i.id === updTrack.id);
    if (index !== -1) {
      if (action === 'remove') {
        this.favorites.tracks.splice(index, 1);
      }
    } else {
      if (action === 'add') this.favorites.tracks.push(updTrack);
    }
  }
}
