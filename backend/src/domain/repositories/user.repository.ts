import { User } from '../entities/user.entity';
import { Email } from '../value-objects/email';

export interface IUserRepository {
  /**
   * Encontra um usuário por ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Encontra um usuário por email
   */
  findByEmail(email: Email): Promise<User | null>;

  /**
   * Salva um novo usuário
   */
  save(user: User): Promise<User>;

  /**
   * Atualiza um usuário existente
   */
  update(user: User): Promise<User>;

  /**
   * Remove um usuário (soft delete)
   */
  delete(id: string): Promise<void>;

  /**
   * Verifica se um email já está em uso
   */
  existsByEmail(email: Email): Promise<boolean>;

  /**
   * Lista todos os usuários com paginação
   */
  findAll(page: number, limit: number): Promise<{ users: User[]; total: number }>;
}
