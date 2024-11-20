import { Album } from '../../album/entity/album.entity';
import { Artist } from '../../artist/entity/artist.entity';
import { Track } from '../../track/entity/track.entity';
import { Entity } from 'typeorm';

@Entity()
export class Favorite {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
