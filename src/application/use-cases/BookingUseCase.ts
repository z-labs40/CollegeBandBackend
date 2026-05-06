import { IBookingRepository } from '../repositories/IBookingRepository';
import { Booking, BookingStatus, UserRole } from '../../domain/entities';

import { ConflictError, NotFoundError, UnauthorizedError, BadRequestError } from '../../shared/error';

export class BookingUseCase {
  constructor(private bookingRepository: IBookingRepository) {}

  async createBooking(data: any, userId: number): Promise<Booking> {
    // Conflict detection
    const conflict = await this.bookingRepository.findConflicting(data.date, data.slotId);
    if (conflict) {
      throw new ConflictError('This slot is already booked or pending approval.');
    }

    const booking: Booking = {
      userId,
      date: data.date,
      slotId: data.slotId,
      slotLabel: data.slotLabel,
      bandName: data.bandName,
      status: BookingStatus.PENDING,
      purpose: data.purpose
    };

    return await this.bookingRepository.create(booking);
  }

  async getBookings(userId: number, role: UserRole): Promise<Booking[]> {
    if (role === UserRole.ADMIN) {
      return await this.bookingRepository.findAll();
    }
    return await this.bookingRepository.findByUserId(userId);
  }

  async updateBookingStatus(id: number, status: BookingStatus): Promise<Booking> {
    const booking = await this.bookingRepository.findById(id);
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    const updated = await this.bookingRepository.updateStatus(id, status);
    if (!updated) {
      throw new BadRequestError('Failed to update status');
    }

    return updated;
  }

  async cancelBooking(id: number, userId: number): Promise<boolean> {
    const booking = await this.bookingRepository.findById(id);
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new UnauthorizedError('Unauthorized');
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestError('Can only cancel pending bookings');
    }

    return await this.bookingRepository.delete(id);
  }
}
