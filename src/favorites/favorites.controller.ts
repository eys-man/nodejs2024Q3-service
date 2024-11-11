import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  Put,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesDto } from './dto/favorites.dto';
import { StatusCodes } from 'http-status-codes';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}
  @Get()
  getAll(): FavoritesDto {
    return this.favoritesService.getAllFavorites();
  }

  @Post(`track/:id`)
  addTrack(@Body() trackId: string) {
    return this.favoritesService.addTrack(trackId);
  }

  @Post(`album/:id`)
  addAlbum(@Body() albumId: string) {
    return this.favoritesService.addTrack(albumId);
  }

  @Post(`artist/:id`)
  addArtist(@Body() artistId: string) {
    return this.favoritesService.addTrack(artistId);
  }

  @Delete(`track/:id`)
  removeTrack(@Body() trackId: string) {
    return this.favoritesService.removeTrack(trackId);
  }

  @Delete(`album/:id`)
  removeAlbum(@Body() albumId: string) {
    return this.favoritesService.removeAlbum(albumId);
  }
  @Delete(`artist/:id`)
  removeArtist(@Body() artistId: string) {
    return this.favoritesService.removeArtist(artistId);
  }
}
