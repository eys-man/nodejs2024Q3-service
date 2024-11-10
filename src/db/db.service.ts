import { Injectable } from '@nestjs/common';
import { UserDto } from '../user/dto/users.dto';
import { ArtistDto } from '../artist/dto/artist.dto';
import { TrackDto } from '../track/dto/track.dto';

@Injectable()
export class DatabaseService {
  private users: UserDto[] = [];
  private artists: ArtistDto[] = [];
  private tracks: TrackDto[] = [];

  getUsers() {
    return this.users;
  }

  getArtists() {
    return this.artists;
  }

  getTracks() {
    return this.tracks;
  }
}
