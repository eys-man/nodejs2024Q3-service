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
import { config } from 'dotenv';
import { Migrations1732414539170 } from './db/1732414539170-migrations';
import { LoggingModule } from './logging/logging.module';

config();

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
          url: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DOCKER_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
          synchronize: false,
          logging: true,
          entities: [Artist, Album, Track, User],
          // migrations: [`${__dirname}/db/migrations/*.ts`],
          migrations: [Migrations1732414539170],
          migrationsRun: true,
        };
      },
    }),
    UserModule,
    ArtistModule,
    TrackModule,
    AlbumModule,
    FavoritesModule,
    LoggingModule,
  ],
})
export class AppModule {}
