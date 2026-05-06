import { Request, Response, NextFunction } from 'express';
import { BookingUseCase } from '../../application/use-cases/BookingUseCase';

export class BookingController {
  constructor(private bookingUseCase: BookingUseCase) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const booking = await this.bookingUseCase.createBooking(req.body, userId);
      res.status(201).json(booking);
    } catch (error: any) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, role } = (req as any).user;
      const bookings = await this.bookingUseCase.getBookings(id, role);
      res.status(200).json(bookings);
    } catch (error: any) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const booking = await this.bookingUseCase.updateBookingStatus(Number(id), status);
      res.status(200).json(booking);
    } catch (error: any) {
      next(error);
    }
  }

  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      await this.bookingUseCase.cancelBooking(Number(id), userId);
      res.status(200).json({ message: 'Booking cancelled successfully' });
    } catch (error: any) {
      next(error);
    }
  }
}
