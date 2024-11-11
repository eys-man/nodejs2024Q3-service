import { Controller, Get, Post, Delete, Param, HttpCode } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesDto } from './dto/favorites.dto';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}
  @Get()
  getAll(): FavoritesDto {
    return this.favoritesService.getAllFavorites();
  }

  @Post(`track/:id`)
  addTrack(@Param('id') id: string) {
    return this.favoritesService.addTrack(id);
  }

  @Post(`album/:id`)
  addAlbum(@Param('id') id: string) {
    return this.favoritesService.addAlbum(id);
  }

  @Post(`artist/:id`)
  addArtist(@Param('id') id: string) {
    return this.favoritesService.addArtist(id);
  }

  @Delete(`track/:id`)
  @HttpCode(204)
  removeTrack(@Param('id') id: string) {
    return this.favoritesService.removeTrack(id);
  }

  @Delete(`album/:id`)
  @HttpCode(204)
  removeAlbum(@Param('id') id: string) {
    return this.favoritesService.removeAlbum(id);
  }
  @Delete(`artist/:id`)
  @HttpCode(204)
  removeArtist(@Param('id') id: string) {
    return this.favoritesService.removeArtist(id);
  }
}
