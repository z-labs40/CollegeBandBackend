import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { initializeDatabase } from '../infrastructure/database';
import router from './routes';
import { errorHandler } from './middleware/errorHandler';
import { Logger } from '../shared/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://collegemusicband--erp-b2b69.us-east4.hosted.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api', router);

// Global Error Handler (Must be after routes)
app.use(errorHandler);

// Initialize DB and Start Server
const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      Logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error: any) {
    Logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
