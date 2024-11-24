import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNumber()
  @IsDefined()
  duration: number; // integer number
  @IsUUID()
  @IsOptional()
  artistId: string | null; // refers to Artist
  @IsUUID()
  @IsOptional()
  albumId: string | null; // refers to Album
}

export class TrackDto extends CreateTrackDto {
  @IsUUID()
  id: string; // uuid v4
}
