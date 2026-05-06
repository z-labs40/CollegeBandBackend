import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { UserModel } from './models/UserModel';
import { BookingModel } from './models/BookingModel';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'bandroom_db',
  synchronize: true, // Set to false in production
  logging: false,
  entities: [UserModel, BookingModel],
  subscribers: [],
  migrations: [],
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');
  } catch (err) {
    console.error('Error during Data Source initialization', err);
    throw err;
  }
};
