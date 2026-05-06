import { Router } from 'express';
import { AuthController } from '../../adapters/controllers/AuthController';
import { BookingController } from '../../adapters/controllers/BookingController';
import { AuthUseCase } from '../../application/use-cases/AuthUseCase';
import { BookingUseCase } from '../../application/use-cases/BookingUseCase';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { BookingRepository } from '../../infrastructure/repositories/BookingRepository';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// Dependency Injection
const userRepository = new UserRepository();
const bookingRepository = new BookingRepository();

const authUseCase = new AuthUseCase(userRepository);
const bookingUseCase = new BookingUseCase(bookingRepository);

const authController = new AuthController(authUseCase);
const bookingController = new BookingController(bookingUseCase);

// Auth Routes
router.post('/auth/signup', (req, res, next) => authController.signup(req, res, next));
router.post('/auth/login', (req, res, next) => authController.login(req, res, next));

// Booking Routes
router.get('/bookings', authMiddleware, (req, res, next) => bookingController.getAll(req, res, next));
router.post('/bookings', authMiddleware, (req, res, next) => bookingController.create(req, res, next));
router.patch('/bookings/:id/status', authMiddleware, adminMiddleware, (req, res, next) => bookingController.updateStatus(req, res, next));
router.delete('/bookings/:id', authMiddleware, (req, res, next) => bookingController.cancel(req, res, next));

export default router;
