export class TrackDto {
  id: string; // uuid v4
  name: string;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
  duration: number; // integer number
}

export class CreateTrackDto {
  name: string;
  duration: number; // integer number
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
}
