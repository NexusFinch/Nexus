import { Hono } from 'hono';
import { login, register, verifyToken, changePassword, resetPassword } from './controller';

const auth = new Hono();

auth.post('/login', login);
auth.post('/register', register);
auth.post('/verify', verifyToken);
auth.post('/change-password', changePassword);
auth.post('/reset-password', resetPassword);

export default auth;
