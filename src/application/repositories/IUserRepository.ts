import { User } from '../../domain/entities';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  create(user: User): Promise<User>;
}
