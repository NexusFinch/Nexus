import { Context } from 'hono';
import { D1Database } from '@cloudflare/workers-types';
import { AuthService } from '../services/AuthService';

export async function login(c: Context) {
  const db = c.env.DB as D1Database;
  const authService = new AuthService(db);
  
  try {
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ success: false, message: 'Email and password are required' }, 400);
    }
    
    const result = await authService.login(email, password);
    
    if (!result) {
      return c.json({ success: false, message: 'Invalid email or password' }, 401);
    }
    
    return c.json({ success: true, data: result });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ success: false, message: 'An error occurred during login' }, 500);
  }
}

export async function register(c: Context) {
  const db = c.env.DB as D1Database;
  const authService = new AuthService(db);
  
  try {
    const { email, password, firstName, lastName, companyId, role } = await c.req.json();
    
    if (!email || !password || !firstName || !lastName || !companyId) {
      return c.json({ success: false, message: 'Missing required fields' }, 400);
    }
    
    const result = await authService.register(email, password, firstName, lastName, companyId, role);
    
    if (!result) {
      return c.json({ success: false, message: 'User already exists or registration failed' }, 400);
    }
    
    return c.json({ success: true, data: result });
  } catch (error) {
    console.error('Registration error:', error);
    return c.json({ success: false, message: 'An error occurred during registration' }, 500);
  }
}

export async function verifyToken(c: Context) {
  const db = c.env.DB as D1Database;
  const authService = new AuthService(db);
  
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ success: false, message: 'No token provided' }, 401);
    }
    
    const token = authHeader.substring(7);
    const user = await authService.verifyToken(token);
    
    if (!user) {
      return c.json({ success: false, message: 'Invalid or expired token' }, 401);
    }
    
    return c.json({ success: true, data: { user } });
  } catch (error) {
    console.error('Token verification error:', error);
    return c.json({ success: false, message: 'An error occurred during token verification' }, 500);
  }
}

export async function changePassword(c: Context) {
  const db = c.env.DB as D1Database;
  const authService = new AuthService(db);
  
  try {
    const { userId, currentPassword, newPassword } = await c.req.json();
    
    if (!userId || !currentPassword || !newPassword) {
      return c.json({ success: false, message: 'Missing required fields' }, 400);
    }
    
    const success = await authService.changePassword(userId, currentPassword, newPassword);
    
    if (!success) {
      return c.json({ success: false, message: 'Current password is incorrect or user not found' }, 400);
    }
    
    return c.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    return c.json({ success: false, message: 'An error occurred during password change' }, 500);
  }
}

export async function resetPassword(c: Context) {
  const db = c.env.DB as D1Database;
  const authService = new AuthService(db);
  
  try {
    const { email, newPassword } = await c.req.json();
    
    if (!email || !newPassword) {
      return c.json({ success: false, message: 'Missing required fields' }, 400);
    }
    
    const success = await authService.resetPassword(email, newPassword);
    
    if (!success) {
      return c.json({ success: false, message: 'User not found' }, 400);
    }
    
    return c.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    return c.json({ success: false, message: 'An error occurred during password reset' }, 500);
  }
}
