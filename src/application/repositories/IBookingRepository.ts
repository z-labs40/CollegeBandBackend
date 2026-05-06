import { Booking, BookingStatus } from '../../domain/entities';

export interface IBookingRepository {
  create(booking: Booking): Promise<Booking>;
  findAll(): Promise<Booking[]>;
  findByUserId(userId: number): Promise<Booking[]>;
  findById(id: number): Promise<Booking | null>;
  updateStatus(id: number, status: BookingStatus): Promise<Booking | null>;
  delete(id: number): Promise<boolean>;
  findConflicting(date: string, slotId: string): Promise<Booking | null>;
}
