import { IsArray } from 'class-validator';
import { AlbumDto } from '../../album/dto/album.dto';
import { ArtistDto } from '../../artist/dto/artist.dto';
import { TrackDto } from '../../track/dto/track.dto';

export class FavoritesDto {
  @IsArray()
  artists: ArtistDto[];
  @IsArray()
  albums: AlbumDto[];
  @IsArray()
  tracks: TrackDto[];
}
