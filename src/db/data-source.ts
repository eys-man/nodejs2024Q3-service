import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { User } from 'src/user/entity/user.entity';
import { Artist } from 'src/artist/entity/artist.entity';
import { Album } from 'src/album/entity/album.entity';
import { Track } from 'src/track/entity/track.entity';
import { Migrations1732414539170 } from './1732414539170-migrations';

config();

const databaseConfig: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Artist, Album, Track],
    synchronize: false,
    logging: true,
    migrations: [Migrations1732414539170],
    // migrations: ['./*migrations*.*'],
    migrationsRun: true,
  };

const AppDataSource = new DataSource(databaseConfig);
export default AppDataSource;
