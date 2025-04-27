# Dubai SME Accounting System - Technical Documentation

## System Architecture

The Dubai SME Accounting System is built using a modern web application architecture with the following components:

### Frontend
- **Framework**: Next.js 15.x with React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks and Context API
- **API Communication**: Custom hooks for API requests

### Backend
- **API Framework**: Hono.js running on Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite-compatible distributed database)
- **Authentication**: JWT-based authentication system
- **File Storage**: Cloudflare R2 (for document storage)

### Infrastructure
- **Hosting**: Cloudflare Pages (frontend) and Cloudflare Workers (backend)
- **CI/CD**: GitHub Actions for automated deployment
- **Monitoring**: Cloudflare Analytics

## Database Schema

The system uses a relational database with the following core tables:

### Users and Companies
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company_id INTEGER NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  country TEXT NOT NULL,
  tax_number TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,
  base_currency TEXT NOT NULL DEFAULT 'AED',
  fiscal_year_start TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Chart of Accounts
```sql
CREATE TABLE accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL,
  account_code TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_type TEXT NOT NULL,
  account_category TEXT NOT NULL,
  parent_account_id INTEGER,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (parent_account_id) REFERENCES accounts(id),
  UNIQUE(company_id, account_code)
);
```

### Products and Inventory
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  category TEXT,
  unit TEXT,
  sale_price REAL NOT NULL,
  purchase_price REAL,
  tax_rate REAL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id),
  UNIQUE(company_id, code)
);

CREATE TABLE warehouses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  warehouse_id INTEGER NOT NULL,
  quantity_on_hand REAL NOT NULL DEFAULT 0,
  reorder_level REAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
  UNIQUE(product_id, warehouse_id)
);
```

### Invoices
```sql
CREATE TABLE invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL,
  invoice_number TEXT NOT NULL,
  invoice_type TEXT NOT NULL,
  customer_id INTEGER,
  customer_name TEXT,
  customer_address TEXT,
  customer_tax_number TEXT,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  subtotal REAL NOT NULL,
  tax_amount REAL NOT NULL,
  discount_amount REAL NOT NULL,
  total_amount REAL NOT NULL,
  notes TEXT,
  status TEXT NOT NULL,
  created_by INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  UNIQUE(company_id, invoice_number)
);

CREATE TABLE invoice_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_id INTEGER NOT NULL,
  product_id INTEGER,
  description TEXT NOT NULL,
  quantity REAL NOT NULL,
  unit_price REAL NOT NULL,
  tax_rate REAL NOT NULL,
  tax_amount REAL NOT NULL,
  discount_rate REAL NOT NULL DEFAULT 0,
  discount_amount REAL NOT NULL DEFAULT 0,
  total_amount REAL NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### Accounting
```sql
CREATE TABLE journal_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL,
  entry_number TEXT NOT NULL,
  entry_date DATE NOT NULL,
  description TEXT NOT NULL,
  reference TEXT,
  is_posted BOOLEAN NOT NULL DEFAULT false,
  created_by INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  UNIQUE(company_id, entry_number)
);

CREATE TABLE journal_lines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  journal_entry_id INTEGER NOT NULL,
  account_id INTEGER NOT NULL,
  description TEXT,
  debit_amount REAL NOT NULL DEFAULT 0,
  credit_amount REAL NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES accounts(id)
);
```

## API Endpoints

The system provides a comprehensive set of RESTful API endpoints:

### Authentication
- `POST /api/auth/login`: Authenticate user and get JWT token
- `POST /api/auth/register`: Register new user
- `POST /api/auth/verify`: Verify JWT token
- `POST /api/auth/change-password`: Change user password
- `POST /api/auth/reset-password`: Reset user password

### Users
- `GET /api/users`: Get all users for a company
- `GET /api/users/:id`: Get user by ID
- `POST /api/users`: Create new user
- `PUT /api/users/:id`: Update user
- `DELETE /api/users/:id`: Delete user

### Companies
- `GET /api/companies`: Get all companies
- `GET /api/companies/:id`: Get company by ID
- `POST /api/companies`: Create new company
- `PUT /api/companies/:id`: Update company
- `DELETE /api/companies/:id`: Delete company

### Products
- `GET /api/products`: Get all products for a company
- `GET /api/products/active`: Get active products
- `GET /api/products/category`: Get products by category
- `GET /api/products/code`: Get product by code
- `GET /api/products/:id`: Get product by ID
- `POST /api/products`: Create new product
- `PUT /api/products/:id`: Update product
- `DELETE /api/products/:id`: Delete product

### Invoices
- `GET /api/invoices`: Get all invoices for a company
- `GET /api/invoices/status`: Get invoices by status
- `GET /api/invoices/overdue`: Get overdue invoices
- `GET /api/invoices/:id`: Get invoice by ID
- `POST /api/invoices`: Create new invoice
- `PUT /api/invoices/:id`: Update invoice
- `DELETE /api/invoices/:id`: Delete invoice

### Accounting
- `GET /api/accounting/accounts`: Get chart of accounts
- `GET /api/accounting/accounts/type`: Get accounts by type
- `GET /api/accounting/accounts/:id`: Get account by ID
- `POST /api/accounting/accounts`: Create new account
- `PUT /api/accounting/accounts/:id`: Update account
- `DELETE /api/accounting/accounts/:id`: Delete account
- `GET /api/accounting/journal-entries`: Get journal entries
- `GET /api/accounting/journal-entries/:id`: Get journal entry with lines
- `POST /api/accounting/journal-entries`: Create new journal entry
- `POST /api/accounting/journal-entries/:id/post`: Post journal entry

### Inventory
- `GET /api/inventory/warehouses`: Get warehouses
- `GET /api/inventory/warehouses/:id`: Get warehouse by ID
- `POST /api/inventory/warehouses`: Create new warehouse
- `PUT /api/inventory/warehouses/:id`: Update warehouse
- `DELETE /api/inventory/warehouses/:id`: Delete warehouse
- `GET /api/inventory`: Get inventory
- `GET /api/inventory/product/:id`: Get product inventory
- `POST /api/inventory/adjust`: Adjust inventory
- `GET /api/inventory/low-stock`: Get low stock items
- `GET /api/inventory/summary`: Get inventory summary

## Frontend Components

The frontend is organized into the following main components:

### Layout Components
- `Layout.tsx`: Main layout wrapper with sidebar and header
- `Header.tsx`: Top navigation bar with user menu
- `Sidebar.tsx`: Navigation sidebar with collapsible sections

### UI Components
- `Card.tsx`: Reusable card component for content sections
- `Table.tsx`: Data table with sorting and filtering
- `Charts.tsx`: Data visualization components
- `Form.tsx`: Form components with validation

### Module-Specific Components
- `Dashboard/`: Dashboard components and widgets
- `Invoices/`: Invoice management components
- `Inventory/`: Inventory management components
- `Accounting/`: Accounting and financial components
- `Reports/`: Reporting components

## Authentication and Authorization

The system uses JWT (JSON Web Tokens) for authentication:

1. User logs in with email and password
2. Server validates credentials and issues a JWT token
3. Client stores token in localStorage
4. Token is included in Authorization header for API requests
5. Server validates token for each request
6. User roles determine access to specific features

## Data Flow

1. User interacts with the frontend UI
2. Frontend components call API hooks
3. API requests are sent to backend endpoints
4. Backend controllers validate requests
5. Service layer processes business logic
6. Database operations are performed
7. Results are returned to the frontend
8. UI is updated with the new data

## Security Considerations

- **Authentication**: JWT tokens with appropriate expiration
- **Password Security**: Bcrypt hashing for passwords
- **Input Validation**: Server-side validation for all inputs
- **CORS**: Proper CORS configuration
- **Rate Limiting**: API rate limiting to prevent abuse
- **SQL Injection**: Parameterized queries for database operations
- **XSS Protection**: Content Security Policy and output encoding

## Performance Optimization

- **Code Splitting**: Dynamic imports for route-based code splitting
- **Caching**: API response caching where appropriate
- **Lazy Loading**: Lazy loading of components and images
- **Database Indexing**: Proper indexes on frequently queried columns
- **Query Optimization**: Efficient SQL queries with proper joins

## Deployment Process

1. Build the frontend application:
   ```
   npm run build
   ```

2. Deploy the application to Cloudflare:
   ```
   wrangler deploy
   ```

3. Apply database migrations:
   ```
   wrangler d1 migrations apply DB
   ```

## Maintenance and Monitoring

- **Error Logging**: Centralized error logging
- **Performance Monitoring**: API response times and resource usage
- **Database Monitoring**: Query performance and resource usage
- **User Activity Tracking**: Audit logs for important actions
- **Automated Backups**: Regular database backups
