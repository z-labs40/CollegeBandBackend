import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUserRepository } from '../repositories/IUserRepository';
import { User, UserRole } from '../../domain/entities';

import { ConflictError, UnauthorizedError } from '../../shared/error';

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
      role: data.role || UserRole.STUDENT,
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

  private generateToken(user: User): string {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );
  }
}
