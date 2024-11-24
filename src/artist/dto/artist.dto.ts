import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateArtistDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsBoolean()
  grammy: boolean;
}

export class ArtistDto extends CreateArtistDto {
  @IsUUID()
  id: string; // uuid v4
}
