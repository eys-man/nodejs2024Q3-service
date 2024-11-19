import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/artist.dto';
import { Artist } from './entity/artist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist) private artistRepository: Repository<Artist>,
  ) {}

  createArtist(createArtistDto: CreateArtistDto): Promise<Artist> {
    return this.artistRepository.save(createArtistDto);
  }

  public getAllArtists(): Promise<Artist[]> {
    return this.artistRepository.find();
  }

  getArtistById(id: string): Promise<Artist | null> {
    return this.artistRepository.findOneBy({ id });
  }

  async updateArtist(
    id: string,
    updateData: Partial<Artist>,
  ): Promise<Artist | null> {
    const artist: Artist | null = await this.artistRepository.findOneBy({ id });

    if (!artist) return null;

    return this.artistRepository.save({ ...artist, ...updateData });
  }

  deleteArtist(artist: Artist): Promise<Artist> {
    return this.artistRepository.remove(artist);
  }
}
