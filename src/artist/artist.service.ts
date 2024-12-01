import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/artist.dto';
import { Artist } from './entity/artist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate } from 'uuid';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist) private artistsRepo: Repository<Artist>,
  ) {}

  async createArtist(newArtist: CreateArtistDto): Promise<CreateArtistDto> {
    if (
      typeof newArtist.name !== 'string' ||
      typeof newArtist.grammy !== 'boolean'
    )
      throw new HttpException('Invalid initial data', HttpStatus.BAD_REQUEST);

    await this.artistsRepo.save(newArtist);

    return newArtist;
  }

  async getAllArtists(): Promise<Artist[]> {
    return await this.artistsRepo.find();
  }

  async getArtistById(searchId: string): Promise<Artist> {
    // проверка на валидность id артиста
    if (!validate(searchId))
      throw new HttpException('ArtistId is not uuid', HttpStatus.BAD_REQUEST);

    // поиск артиста
    const artist = await this.artistsRepo.findOneBy({ id: searchId } );
    if (!artist)
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);

    return artist;
  }
  
  async getFavoritesArtists(): Promise<Artist[]> {
    return await this.artistsRepo.find({
      where: { isFavorite: true },
      select: ['id', 'name', 'grammy'],
    });
  }

  async addArtistToFavorites(newArtist: string) {
    const artist = await this.artistsRepo.findOneBy({id:newArtist});
    if (!artist)
      throw new HttpException('Artist not exists', HttpStatus.UNPROCESSABLE_ENTITY);

    artist.isFavorite = true;

    // return await this.artistsRepo.save(artist);
    const addedArtist = await this.artistsRepo.save(artist);
    if (!addedArtist)
      throw new HttpException('Artist not added', HttpStatus.INTERNAL_SERVER_ERROR);

    return addedArtist;
  }

  async delArtistFromFavorites(delArtist: string): Promise<Artist> {
    const artist = await this.getArtistById(delArtist);
    artist.isFavorite = false;
    await this.artistsRepo.save(artist);

    return artist;
  }

  async updateArtist(
    searchId: string,
    newArtistData: CreateArtistDto,
  ): Promise<Artist> {
    // проверка на пустой dto
    if (Object.keys(newArtistData).length == 0)
      throw new HttpException('Invalid dto', HttpStatus.BAD_REQUEST);

    // проверка на валидность id трека
    if (!validate(searchId))
      throw new HttpException('ArtistId is not uuid', HttpStatus.BAD_REQUEST);

    if (
      typeof newArtistData.name !== 'string' ||
      typeof newArtistData.grammy !== 'boolean'
    )
      throw new HttpException('Invalid initial data', HttpStatus.BAD_REQUEST);

    // поиск артиста
    const artist = await this.getArtistById(searchId);
    if (!artist)
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);

    artist.name = newArtistData.name;
    artist.grammy = newArtistData.grammy;

    await this.artistsRepo.save(artist);
    return artist;
  }

  async deleteArtist(searchId: string): Promise<CreateArtistDto> {
    // проверка на валидность id артиста
    if (!validate(searchId))
      throw new HttpException('ArtistId is not uuid', HttpStatus.BAD_REQUEST);

    // поиск артиста
    const artist = await this.getArtistById(searchId);
    if (!artist)
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);

    // удалить из базы
    await this.artistsRepo.delete({ id: searchId });

    return artist;
  }
}
