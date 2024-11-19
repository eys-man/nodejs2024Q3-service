import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) ?? 5432,
  database: process.env.DB_NAME,
  entities: [`${__dirname}/**/*.entity.ts`],
  migrations: [`${__dirname}/db/migrations/*.ts`],
});

AppDataSource.initialize()
  .then(() => console.log('Data Source has been initialized!'))
  .catch((err) => {
    console.error('Error during Data Source initializing!', err);
  });

export default AppDataSource;
