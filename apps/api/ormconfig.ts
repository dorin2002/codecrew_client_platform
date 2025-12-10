import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'codecrew',
  password: process.env.DB_PASSWORD || 'codecrew_local',
  database: process.env.DB_NAME || 'codecrew_portal',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.NODE_ENV === 'development',
});
