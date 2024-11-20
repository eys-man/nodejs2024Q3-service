import { forwardRef, Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './entity/album.entity';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { TrackModule } from 'src/track/track.module';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService],
  imports: [
    TypeOrmModule.forFeature([Album]),
    forwardRef(() => FavoritesModule),
    forwardRef(() => TrackModule),
  ],
})
export class AlbumModule {}
