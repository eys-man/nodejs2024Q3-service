import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';
import { User } from 'src/user/entity/user.entity';
import { Artist } from 'src/artist/entity/artist.entity';
import { Album } from 'src/album/entity/album.entity';
import { Track } from 'src/track/entity/track.entity';
import { Favorites } from 'src/favorites/entity/favorites.entity';
import { Migrations1733006481502 } from './1733006481502-migrations';

const url = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DOCKER_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

export const dbConfig: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    url,
    entities: [
      User,
      Artist,
      Album,
      Track,
      Favorites,  // под вопросом
    ],
    synchronize: false,
    logging: true,
    migrations: [Migrations1733006481502],
    // migrations: ['./*migrations*.*'],
    migrationsRun: true,
  };
  
  const appDataSource = new DataSource(dbConfig);
  export default appDataSource;
