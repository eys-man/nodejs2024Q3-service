import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNumber()
  @IsDefined()
  year: number;
  @IsUUID()
  @IsOptional()
  artistId: string | null; // refers to Artist
}

export class AlbumDto extends CreateAlbumDto {
  @IsUUID()
  id: string; // uuid v4
}
