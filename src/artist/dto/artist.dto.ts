export class ArtistDto {
  id: string; // uuid v4
  name: string;
  grammy: boolean;
}

export class CreateArtistDto {
  name: string;
  grammy: boolean;
}
