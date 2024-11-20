import { forwardRef, Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from './entity/track.entity';
import { FavoritesModule } from 'src/favorites/favorites.module';

@Module({
  controllers: [TrackController],
  providers: [TrackService],
  imports: [
    TypeOrmModule.forFeature([Track]),
    forwardRef(() => FavoritesModule),
  ],
})
export class TrackModule {}
