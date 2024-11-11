export class AlbumDto {
  id: string; // uuid v4
  name: string;
  year: number;
  artistId: string | null; // refers to Artist
}

export class CreateAlbumDto {
  name: string;
  year: number;
  artistId: string | null; // refers to Artist
}
