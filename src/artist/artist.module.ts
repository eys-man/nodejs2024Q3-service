import { forwardRef, Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './entity/artist.entity';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { AlbumModule } from 'src/album/album.module';
import { TrackModule } from 'src/track/track.module';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService],
  imports: [
    TypeOrmModule.forFeature([Artist]),
    forwardRef(() => FavoritesModule),
    forwardRef(() => AlbumModule),
    forwardRef(() => TrackModule),
  ],
})
export class ArtistModule {}
