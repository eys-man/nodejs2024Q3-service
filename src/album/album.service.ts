import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/album.dto';
import { Album } from './entity/album.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album) private albumRepository: Repository<Album>,
  ) {}

  createAlbum(createAlbumDto: CreateAlbumDto): Promise<Album> {
    return this.albumRepository.save(createAlbumDto);
  }

  getAllAlbums(): Promise<Album[]> {
    return this.albumRepository.find();
  }

  getAlbumById(id: string): Promise<Album | null> {
    return this.albumRepository.findOneBy({ id });
  }

  async updateAlbum(
    id: string,
    updateData: Partial<Album>,
  ): Promise<Album | null> {
    const album: Album | null = await this.albumRepository.findOneBy({ id });

    if (!album) return null;

    return this.albumRepository.save({ ...album, ...updateData });
  }

  deleteAlbum(album: Album): Promise<Album> {
    return this.albumRepository.remove(album);
  }
}
