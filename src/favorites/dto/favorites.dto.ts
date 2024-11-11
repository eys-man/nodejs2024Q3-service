import { AlbumDto } from '../../album/dto/album.dto';
import { ArtistDto } from '../../artist/dto/artist.dto';
import { TrackDto } from '../../track/dto/track.dto';

export class FavoritesDto {
  artists: ArtistDto[];
  albums: AlbumDto[];
  tracks: TrackDto[];
}
