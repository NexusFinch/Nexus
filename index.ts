import { Hono } from 'hono';
import auth from './auth/route';
import users from './users/route';
import companies from './companies/route';
import products from './products/route';
import invoices from './invoices/route';
import accounting from './accounting/route';
import inventory from './inventory/route';

const api = new Hono();

api.route('/auth', auth);
api.route('/users', users);
api.route('/companies', companies);
api.route('/products', products);
api.route('/invoices', invoices);
api.route('/accounting', accounting);
api.route('/inventory', inventory);

export default api;
