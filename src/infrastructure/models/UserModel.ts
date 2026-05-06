import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserRole } from '../../domain/entities';

@Entity('users')
export class UserModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fullName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT
  })
  role!: UserRole;

  @Column({ nullable: true })
  bandName?: string;
}
