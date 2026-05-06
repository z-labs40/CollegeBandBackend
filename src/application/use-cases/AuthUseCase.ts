import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUserRepository } from '../repositories/IUserRepository';
import { User, UserRole } from '../../domain/entities';

import { ConflictError, UnauthorizedError, ForbiddenError } from '../../shared/error';

export class AuthUseCase {
  constructor(private userRepository: IUserRepository) {}

  async signup(data: any): Promise<any> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('User already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.create({
      fullName: data.fullName,
      email: data.email,
      passwordHash,
      role: UserRole.STUDENT, // Hardcoded for security
      bandName: data.bandName
    });

    const token = this.generateToken(user);
    return { user, token };
  }

  async login(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  async adminLogin(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenError('Access denied: Admin only');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  async setupAdmin(data: any): Promise<any> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('Admin already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.create({
      fullName: data.fullName,
      email: data.email,
      passwordHash,
      role: UserRole.ADMIN,
      bandName: 'Faculty'
    });

    return { message: 'Admin created successfully', user };
  }

  private generateToken(user: User): string {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );
  }
}
