import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Organization } from '../entities/Organization';
import { User } from '../entities/User';
import { RefreshToken } from '../entities/RefreshToken';
import { Project } from '../entities/Project';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  synchronize: true,
  logging: false,

  entities: [Organization, User, RefreshToken,Project],
  migrations: ['src/migrations/*.ts'],
});

