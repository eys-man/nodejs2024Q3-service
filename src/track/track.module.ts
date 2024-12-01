import { forwardRef, Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from './entity/track.entity';

@Module({
  controllers: [TrackController],
  providers: [TrackService],
  imports: [TypeOrmModule.forFeature([Track])],
  exports: [TrackService],
})
export class TrackModule {}
