import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/track.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Track } from './entity/track.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track) private trackRepository: Repository<Track>,
  ) {}

  createTrack(createTrackDto: CreateTrackDto): Promise<Track> {
    return this.trackRepository.save(createTrackDto);
  }

  getAllTracks(): Promise<Track[]> {
    return this.trackRepository.find();
  }

  getTrackById(id: string): Promise<Track | null> {
    return this.trackRepository.findOneBy({ id });
  }

  async updateTrack(
    id: string,
    updateData: Partial<Track>,
  ): Promise<Track | null> {
    const track: Track | null = await this.trackRepository.findOneBy({ id });

    if (!track) return null;

    return this.trackRepository.save({ ...track, ...updateData });
  }

  public deleteTrack(track: Track): Promise<Track> {
    return this.trackRepository.remove(track);
  }
}
