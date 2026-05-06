export enum UserRole {
  STUDENT = 'Student',
  ADMIN = 'Admin'
}

export interface User {
  id?: number;
  fullName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  bandName?: string;
}

export enum BookingStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}

export interface Booking {
  id?: number;
  userId: number;
  date: string; // ISO format
  slotId: string;
  slotLabel: string;
  bandName: string;
  status: BookingStatus;
  purpose: string;
  createdAt?: Date;
}
