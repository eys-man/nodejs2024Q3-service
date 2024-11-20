import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { TrackModule } from './track/track.module';
import { AlbumModule } from './album/album.module';
import { FavoritesModule } from './favorites/favorites.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Artist } from './artist/entity/artist.entity';
import { Album } from './album/entity/album.entity';
import { Track } from './track/entity/track.entity';
import { User } from './user/entity/user.entity';
import { Favorite } from './favorites/entity/favorite.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => {
        return {
          type: 'postgres',
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASSWORD'),
          host: configService.get('DB_HOST'),
          port: Number(configService.get('DB_PORT')) ?? 5432,
          database: configService.get('DB_NAME'),
          synchronize: false,
          logging: true,
          entities: [Artist, Album, Track, User, Favorite],
          migrations: [`${__dirname}/db/migrations/*.ts`],
          migrationsRun: true,
        };
      },
    }),
    UserModule,
    ArtistModule,
    TrackModule,
    AlbumModule,
    FavoritesModule,
  ],
})
export class AppModule {}
