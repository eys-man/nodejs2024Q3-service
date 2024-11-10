import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TrackDto, CreateTrackDto } from './dto/track.dto';
import { DatabaseService } from '../db/db.service';
import { v4, validate } from 'uuid';

@Injectable()
export class TrackService {
  // private readonly tracks: TrackDto[] = [];
  private tracks = this.databaseService.getTracks();

  constructor(private readonly databaseService: DatabaseService) {}

  createTrack(newTrack: CreateTrackDto): TrackDto {
    if (
      typeof newTrack.name !== 'string' ||
      typeof newTrack.duration !== 'number'
      // !validate(newTrack.albumId) ||
      // !validate(newTrack.artistId)
    )
      throw new HttpException('Invalid initial data', HttpStatus.BAD_REQUEST);

    const track: TrackDto = {
      id: v4(),
      name: newTrack.name,
      artistId: newTrack.artistId,
      albumId: newTrack.albumId,
      duration: newTrack.duration,
    };

    this.tracks.push(track);

    return track;
  }

  getAllTracks(): TrackDto[] {
    return this.tracks;
  }

  getTrackById(searchId: string): TrackDto | undefined {
    // проверка на валидность id трека
    if (!validate(searchId))
      throw new HttpException('TrackId is not uuid', HttpStatus.BAD_REQUEST);

    // поиск трека
    const track = this.tracks.find((i) => i.id === searchId);
    if (!track)
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);

    return track;
  }

  updateTrack(searchId: string, newTrackData: CreateTrackDto): TrackDto {
    // проверка на пустой dto
    if (Object.keys(newTrackData).length == 0)
      throw new HttpException('Invalid dto', HttpStatus.BAD_REQUEST);

    // проверка на валидность id трека
    if (!validate(searchId))
      throw new HttpException('TrackId is not uuid', HttpStatus.BAD_REQUEST);

    if (
      typeof newTrackData.name !== 'string' ||
      typeof newTrackData.duration !== 'number'
      // !validate(newTrackData.albumId) ||
      // !validate(newTrackData.artistId)
    )
      throw new HttpException('Invalid initial data', HttpStatus.BAD_REQUEST);

    // поиск трека
    const track = this.tracks.find((i) => i.id === searchId);
    if (!track)
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);

    return {
      id: track.id,
      name: newTrackData.name,
      artistId: newTrackData.artistId,
      albumId: newTrackData.albumId,
      duration: newTrackData.duration,
    };
  }

  deleteTrack(searchId: string): TrackDto {
    // проверка на валидность id трека
    if (!validate(searchId))
      throw new HttpException('TrackId is not uuid', HttpStatus.BAD_REQUEST);

    // поиск трека
    const deletedTrack = this.tracks.find((i) => i.id === searchId);
    const indexTrack = this.tracks.findIndex((i) => i.id === searchId);
    if (indexTrack === -1)
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);

    this.tracks.splice(indexTrack, 1); // удалить из базы

    return deletedTrack;
  }
}
