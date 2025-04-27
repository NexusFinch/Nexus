import { D1Database } from '@cloudflare/workers-types';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  companyId: number;
  isActive: boolean;
  lastLogin?: string;
}

export class UserService {
  constructor(private db: D1Database) {}

  async getUsers(companyId: number): Promise<User[]> {
    const { results } = await this.db.prepare(
      'SELECT id, email, first_name as firstName, last_name as lastName, role, company_id as companyId, is_active as isActive, last_login as lastLogin FROM users WHERE company_id = ?'
    )
    .bind(companyId)
    .all();
    
    return results as User[];
  }

  async getUserById(id: number): Promise<User | null> {
    const { results } = await this.db.prepare(
      'SELECT id, email, first_name as firstName, last_name as lastName, role, company_id as companyId, is_active as isActive, last_login as lastLogin FROM users WHERE id = ?'
    )
    .bind(id)
    .all();
    
    if (results.length === 0) {
      return null;
    }
    
    return results[0] as User;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const { results } = await this.db.prepare(
      'SELECT id, email, first_name as firstName, last_name as lastName, role, company_id as companyId, is_active as isActive, last_login as lastLogin FROM users WHERE email = ?'
    )
    .bind(email)
    .all();
    
    if (results.length === 0) {
      return null;
    }
    
    return results[0] as User;
  }

  async createUser(user: Omit<User, 'id'>): Promise<number> {
    const result = await this.db.prepare(
      'INSERT INTO users (email, first_name, last_name, role, company_id, is_active) VALUES (?, ?, ?, ?, ?, ?) RETURNING id'
    )
    .bind(user.email, user.firstName, user.lastName, user.role, user.companyId, user.isActive ? 1 : 0)
    .run();
    
    return result.results[0].id as number;
  }

  async updateUser(id: number, user: Partial<User>): Promise<boolean> {
    const updates: string[] = [];
    const values: any[] = [];
    
    if (user.email !== undefined) {
      updates.push('email = ?');
      values.push(user.email);
    }
    
    if (user.firstName !== undefined) {
      updates.push('first_name = ?');
      values.push(user.firstName);
    }
    
    if (user.lastName !== undefined) {
      updates.push('last_name = ?');
      values.push(user.lastName);
    }
    
    if (user.role !== undefined) {
      updates.push('role = ?');
      values.push(user.role);
    }
    
    if (user.companyId !== undefined) {
      updates.push('company_id = ?');
      values.push(user.companyId);
    }
    
    if (user.isActive !== undefined) {
      updates.push('is_active = ?');
      values.push(user.isActive ? 1 : 0);
    }
    
    if (user.lastLogin !== undefined) {
      updates.push('last_login = ?');
      values.push(user.lastLogin);
    }
    
    if (updates.length === 0) {
      return false;
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    values.push(id);
    
    const result = await this.db.prepare(query).bind(...values).run();
    
    return result.success;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await this.db.prepare('DELETE FROM users WHERE id = ?')
      .bind(id)
      .run();
    
    return result.success;
  }

  async updateLastLogin(id: number): Promise<boolean> {
    const result = await this.db.prepare(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    )
    .bind(id)
    .run();
    
    return result.success;
  }
}
