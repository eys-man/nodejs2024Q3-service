import { Injectable } from '@nestjs/common';
import { UserDto } from '../user/dto/users.dto';
import { ArtistDto } from '../artist/dto/artist.dto';

@Injectable()
export class DatabaseService {
  private users: UserDto[] = [];
  private artists: ArtistDto[] = [];

  getUsers() {
    return this.users;
  }

  getArtists() {
    return this.artists;
  }
}
