import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BookingStatus } from '../../domain/entities';
import { UserModel } from './UserModel';

@Entity('bookings')
export class BookingModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @ManyToOne(() => UserModel)
  @JoinColumn({ name: 'userId' })
  user!: UserModel;

  @Column()
  date!: string; // ISO date string

  @Column()
  slotId!: string;

  @Column()
  slotLabel!: string;

  @Column()
  bandName!: string;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING
  })
  status!: BookingStatus;

  @Column({ type: 'text' })
  purpose!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
