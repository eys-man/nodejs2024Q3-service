import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { TrackModule } from './track/track.module';

@Module({
  imports: [UserModule, ArtistModule, TrackModule],
})
export class AppModule {}
