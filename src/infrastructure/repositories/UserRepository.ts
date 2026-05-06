import { Repository } from 'typeorm';
import { AppDataSource } from '../database';
import { UserModel } from '../models/UserModel';
import { User } from '../../domain/entities';
import { IUserRepository } from '../../application/repositories/IUserRepository';

export class UserRepository implements IUserRepository {
  private repository: Repository<UserModel>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserModel);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.repository.findOne({ where: { email } });
    return user || null;
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.repository.findOne({ where: { id } });
    return user || null;
  }

  async create(user: User): Promise<User> {
    const newUser = this.repository.create(user);
    return await this.repository.save(newUser);
  }
}
