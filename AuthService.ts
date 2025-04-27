import { D1Database } from '@cloudflare/workers-types';
import bcrypt from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  companyId: number;
}

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'dubai-sme-accounting-system-secret';
  private readonly JWT_EXPIRES_IN = '24h';
  
  constructor(private db: D1Database) {}
  
  async login(email: string, password: string): Promise<{ user: AuthUser; token: string } | null> {
    // Get user with password
    const { results } = await this.db.prepare(
      `SELECT 
        id, 
        email, 
        password_hash as passwordHash,
        first_name as firstName, 
        last_name as lastName, 
        role, 
        company_id as companyId, 
        is_active as isActive
      FROM users 
      WHERE email = ?`
    )
    .bind(email)
    .all();
    
    if (results.length === 0) {
      return null;
    }
    
    const user = results[0] as any;
    
    // Check if user is active
    if (!user.isActive) {
      return null;
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }
    
    // Update last login
    await this.db.prepare(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    )
    .bind(user.id)
    .run();
    
    // Create token
    const token = sign(
      { 
        id: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId
      },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    );
    
    // Return user without password
    const { passwordHash, isActive, ...authUser } = user;
    
    return {
      user: authUser as AuthUser,
      token
    };
  }
  
  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    companyId: number,
    role: string = 'user'
  ): Promise<{ user: AuthUser; token: string } | null> {
    // Check if user already exists
    const { results } = await this.db.prepare(
      'SELECT id FROM users WHERE email = ?'
    )
    .bind(email)
    .all();
    
    if (results.length > 0) {
      return null; // User already exists
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Start transaction
    await this.db.exec('BEGIN TRANSACTION');
    
    try {
      // Create user
      const userResult = await this.db.prepare(
        `INSERT INTO users (
          email, 
          password_hash, 
          first_name, 
          last_name, 
          role, 
          company_id, 
          is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?) 
        RETURNING id, email, first_name, last_name, role, company_id`
      )
      .bind(
        email,
        passwordHash,
        firstName,
        lastName,
        role,
        companyId,
        1 // Active by default
      )
      .run();
      
      if (!userResult.success) {
        await this.db.exec('ROLLBACK');
        return null;
      }
      
      const user = {
        id: userResult.results[0].id,
        email: userResult.results[0].email,
        firstName: userResult.results[0].first_name,
        lastName: userResult.results[0].last_name,
        role: userResult.results[0].role,
        companyId: userResult.results[0].company_id
      };
      
      // Create token
      const token = sign(
        { 
          id: user.id,
          email: user.email,
          role: user.role,
          companyId: user.companyId
        },
        this.JWT_SECRET,
        { expiresIn: this.JWT_EXPIRES_IN }
      );
      
      // Commit transaction
      await this.db.exec('COMMIT');
      
      return {
        user,
        token
      };
    } catch (error) {
      await this.db.exec('ROLLBACK');
      throw error;
    }
  }
  
  async verifyToken(token: string): Promise<AuthUser | null> {
    try {
      const decoded = verify(token, this.JWT_SECRET) as any;
      
      // Get user from database to ensure it still exists and is active
      const { results } = await this.db.prepare(
        `SELECT 
          id, 
          email, 
          first_name as firstName, 
          last_name as lastName, 
          role, 
          company_id as companyId, 
          is_active as isActive
        FROM users 
        WHERE id = ?`
      )
      .bind(decoded.id)
      .all();
      
      if (results.length === 0 || !results[0].isActive) {
        return null;
      }
      
      const { isActive, ...user } = results[0] as any;
      
      return user as AuthUser;
    } catch (error) {
      return null;
    }
  }
  
  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<boolean> {
    // Get user with password
    const { results } = await this.db.prepare(
      'SELECT password_hash as passwordHash FROM users WHERE id = ?'
    )
    .bind(userId)
    .all();
    
    if (results.length === 0) {
      return false;
    }
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, results[0].passwordHash);
    if (!isPasswordValid) {
      return false;
    }
    
    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    
    // Update password
    const result = await this.db.prepare(
      'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    )
    .bind(newPasswordHash, userId)
    .run();
    
    return result.success;
  }
  
  async resetPassword(email: string, newPassword: string): Promise<boolean> {
    // In a real application, this would involve sending an email with a reset link
    // For this demo, we'll just reset the password directly
    
    // Check if user exists
    const { results } = await this.db.prepare(
      'SELECT id FROM users WHERE email = ?'
    )
    .bind(email)
    .all();
    
    if (results.length === 0) {
      return false;
    }
    
    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    
    // Update password
    const result = await this.db.prepare(
      'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    )
    .bind(newPasswordHash, results[0].id)
    .run();
    
    return result.success;
  }
}
