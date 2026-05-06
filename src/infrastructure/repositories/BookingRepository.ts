import { Repository, Not, In } from 'typeorm';
import { AppDataSource } from '../database';
import { BookingModel } from '../models/BookingModel';
import { Booking, BookingStatus } from '../../domain/entities';
import { IBookingRepository } from '../../application/repositories/IBookingRepository';

export class BookingRepository implements IBookingRepository {
  private repository: Repository<BookingModel>;

  constructor() {
    this.repository = AppDataSource.getRepository(BookingModel);
  }

  async create(booking: Booking): Promise<Booking> {
    const newBooking = this.repository.create(booking);
    return await this.repository.save(newBooking);
  }

  async findAll(): Promise<Booking[]> {
    return await this.repository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async findByUserId(userId: number): Promise<Booking[]> {
    return await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async findById(id: number): Promise<Booking | null> {
    const booking = await this.repository.findOne({ where: { id } });
    return booking || null;
  }

  async updateStatus(id: number, status: BookingStatus): Promise<Booking | null> {
    await this.repository.update(id, { status });
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async findConflicting(date: string, slotId: string): Promise<Booking | null> {
    // Conflict if there's an approved booking for the same date and slot
    const conflicting = await this.repository.findOne({
      where: {
        date,
        slotId,
        status: In([BookingStatus.APPROVED, BookingStatus.PENDING])
      }
    });
    return conflicting || null;
  }
}
