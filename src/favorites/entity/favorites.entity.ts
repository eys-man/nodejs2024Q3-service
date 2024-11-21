import { ArtistDto } from 'src/artist/dto/artist.dto';
// import { Album } from '../../album/entity/album.entity';
// import { Artist } from '../../artist/entity/artist.entity';
// import { Track } from '../../track/entity/track.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AlbumDto } from 'src/album/dto/album.dto';
import { TrackDto } from 'src/track/dto/track.dto';

@Entity()
export class Favorites {
  @PrimaryGeneratedColumn('uuid')
  public id: string;
  @Column()
  artists: ArtistDto[];
  @Column()
  albums: AlbumDto[];
  @Column()
  tracks: TrackDto[];
}
