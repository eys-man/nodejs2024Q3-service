import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { DatabaseModule } from '../db/db.module';

@Module({
  controllers: [TrackController],
  providers: [TrackService],
  imports: [DatabaseModule],
})
export class TrackModule {}
