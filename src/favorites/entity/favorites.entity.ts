import { IsUUID } from 'class-validator';
import { Artist } from '../../artist/entity/artist.entity';
import { Album } from '../../album/entity/album.entity';
import { Track } from '../../track/entity/track.entity';

export class Fav {
  @IsUUID('4', { each: true })
  artists: string[];

  @IsUUID('4', { each: true })
  albums: string[];

  @IsUUID('4', { each: true })
  tracks: string[];

  constructor(partial: Partial<Fav>) {
    Object.assign(this, partial);
  }
}

export class Favorites {
  artists: Artist[];

  albums: Album[];

  tracks: Track[];

  constructor(partial: Partial<Favorites>) {
    Object.assign(this, partial);
  }
}