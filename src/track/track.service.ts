import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/track.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Track } from './entity/track.entity';
import { Repository } from 'typeorm';
import { validate } from 'uuid';

@Injectable()
export class TrackService {
  constructor(@InjectRepository(Track) private tracksRepo: Repository<Track>) {}

  async createTrack(newTrack: CreateTrackDto): Promise<CreateTrackDto> {
    if (
      typeof newTrack.name !== 'string' ||
      typeof newTrack.duration !== 'number'
    )
      throw new HttpException('Invalid initial data', HttpStatus.BAD_REQUEST);

    await this.tracksRepo.save(newTrack);

    return newTrack;
  }

  async getAllTracks(): Promise<Track[]> {
    return await this.tracksRepo.find();
  }

  async getTrackById(searchId: string): Promise<Track> {
    // проверка на валидность id трека
    if (!validate(searchId))
      throw new HttpException('TrackId is not uuid', HttpStatus.BAD_REQUEST);

    // поиск трека
    const track = this.tracksRepo.findOne({ where: { id: searchId } });
    if (!track)
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);

    return track;
  }

  async updateTrack(
    searchId: string,
    newTrackData: CreateTrackDto,
  ): Promise<Track> {
    // проверка на пустой dto
    if (Object.keys(newTrackData).length == 0)
      throw new HttpException('Invalid dto', HttpStatus.BAD_REQUEST);

    // проверка на валидность id трека
    if (!validate(searchId))
      throw new HttpException('TrackId is not uuid', HttpStatus.BAD_REQUEST);

    if (
      typeof newTrackData.name !== 'string' ||
      typeof newTrackData.duration !== 'number'
    )
      throw new HttpException('Invalid initial data', HttpStatus.BAD_REQUEST);

    // поиск трека
    const track = await this.getTrackById(searchId);
    if (!track)
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);

    track.name = newTrackData.name;
    track.artistId = newTrackData.artistId;
    track.albumId = newTrackData.albumId;
    track.duration = newTrackData.duration;

    await this.tracksRepo.save(track);

    return track;
  }

  async deleteTrack(searchId: string): Promise<Track> {
    // проверка на валидность id трека
    if (!validate(searchId))
      throw new HttpException('TrackId is not uuid', HttpStatus.BAD_REQUEST);

    // поиск трека
    const track = await this.getTrackById(searchId);
    if (!track)
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);

    // todo: удалить из фаворитов

    // удалить из базы
    await this.tracksRepo.delete({ id: searchId });

    return track;
  }
}
