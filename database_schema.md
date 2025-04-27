# Database Schema Design for Dubai SME Accounting System

## Overview

This document outlines the database schema design for the accounting system, using a relational database structure that will be implemented with Cloudflare D1 (SQLite-compatible). The schema is designed to support all the functional requirements identified during the research phase.

## Entity Relationship Diagram

The database will consist of the following main entities and their relationships:

```
Users ─────┐
           │
           ▼
Companies ◄────┐
   │           │
   ├──► Chart of Accounts
   │           │
   ├──► Products ◄───┐
   │           │     │
   ├──► Customers    │
   │           │     │
   ├──► Suppliers    │
   │           │     │
   ├──► Invoices ────┘
   │           │
   ├──► Transactions
   │           │
   └──► Tax Records
```

## Tables Structure

### Users
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role TEXT NOT NULL,
    company_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);
```

### Companies
```sql
CREATE TABLE companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    trade_license_number TEXT,
    tax_registration_number TEXT,
    address TEXT,
    city TEXT,
    country TEXT DEFAULT 'UAE',
    phone TEXT,
    email TEXT,
    website TEXT,
    fiscal_year_start DATE,
    base_currency TEXT DEFAULT 'AED',
    logo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Chart of Accounts
```sql
CREATE TABLE chart_of_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    account_code TEXT NOT NULL,
    account_name TEXT NOT NULL,
    account_type TEXT NOT NULL,
    account_category TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    UNIQUE(company_id, account_code)
);
```

### Products
```sql
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    type TEXT NOT NULL, -- inventory, service, etc.
    purchase_price DECIMAL(15,2),
    sale_price DECIMAL(15,2),
    tax_rate DECIMAL(5,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    UNIQUE(company_id, code)
);
```

### Inventory
```sql
CREATE TABLE inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    warehouse_id INTEGER NOT NULL,
    quantity_on_hand INTEGER NOT NULL DEFAULT 0,
    reorder_level INTEGER,
    reorder_quantity INTEGER,
    last_stock_take_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
    UNIQUE(product_id, warehouse_id)
);
```

### Warehouses
```sql
CREATE TABLE warehouses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    location TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);
```

### Customers
```sql
CREATE TABLE customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    country TEXT,
    tax_registration_number TEXT,
    credit_limit DECIMAL(15,2),
    payment_terms INTEGER, -- days
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);
```

### Suppliers
```sql
CREATE TABLE suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    country TEXT,
    tax_registration_number TEXT,
    payment_terms INTEGER, -- days
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);
```

### Invoices
```sql
CREATE TABLE invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    invoice_number TEXT NOT NULL,
    invoice_type TEXT NOT NULL, -- sales, purchase
    customer_id INTEGER,
    supplier_id INTEGER,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status TEXT NOT NULL, -- draft, sent, paid, overdue, cancelled
    subtotal DECIMAL(15,2) NOT NULL,
    tax_amount DECIMAL(15,2) NOT NULL,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) NOT NULL,
    notes TEXT,
    terms TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern TEXT,
    next_recurrence_date DATE,
    e_invoice_status TEXT, -- not_applicable, pending, sent, failed
    e_invoice_reference TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    UNIQUE(company_id, invoice_number)
);
```

### Invoice Items
```sql
CREATE TABLE invoice_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    description TEXT,
    quantity DECIMAL(15,2) NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    tax_rate DECIMAL(5,2),
    tax_amount DECIMAL(15,2),
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### Transactions
```sql
CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    transaction_date DATE NOT NULL,
    transaction_type TEXT NOT NULL, -- sale, purchase, payment, receipt, journal
    reference_number TEXT,
    reference_type TEXT, -- invoice, payment, journal
    reference_id INTEGER,
    description TEXT,
    amount DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);
```

### Journal Entries
```sql
CREATE TABLE journal_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    entry_number TEXT NOT NULL,
    entry_date DATE NOT NULL,
    description TEXT,
    reference TEXT,
    is_posted BOOLEAN DEFAULT FALSE,
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    UNIQUE(company_id, entry_number)
);
```

### Journal Entry Lines
```sql
CREATE TABLE journal_entry_lines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    journal_entry_id INTEGER NOT NULL,
    account_id INTEGER NOT NULL,
    description TEXT,
    debit_amount DECIMAL(15,2) DEFAULT 0,
    credit_amount DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(id),
    FOREIGN KEY (account_id) REFERENCES chart_of_accounts(id)
);
```

### Tax Records
```sql
CREATE TABLE tax_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    tax_period_start DATE NOT NULL,
    tax_period_end DATE NOT NULL,
    tax_type TEXT NOT NULL, -- VAT, corporate tax
    tax_amount DECIMAL(15,2) NOT NULL,
    status TEXT NOT NULL, -- draft, filed, paid
    filing_date DATE,
    payment_date DATE,
    reference_number TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);
```

### Settings
```sql
CREATE TABLE settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    setting_key TEXT NOT NULL,
    setting_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    UNIQUE(company_id, setting_key)
);
```

## Indexes

```sql
-- Performance indexes
CREATE INDEX idx_invoices_company_date ON invoices(company_id, issue_date);
CREATE INDEX idx_transactions_company_date ON transactions(company_id, transaction_date);
CREATE INDEX idx_journal_entries_company_date ON journal_entries(company_id, entry_date);
CREATE INDEX idx_products_company ON products(company_id);
CREATE INDEX idx_customers_company ON customers(company_id);
CREATE INDEX idx_suppliers_company ON suppliers(company_id);
CREATE INDEX idx_chart_of_accounts_company ON chart_of_accounts(company_id);
```

## Data Relationships and Constraints

- Each user belongs to a company
- Each company has multiple users, customers, suppliers, products, and accounts
- Invoices are linked to either customers (sales invoices) or suppliers (purchase invoices)
- Invoice items are linked to products and invoices
- Transactions are linked to invoices, payments, or journal entries
- Journal entries consist of multiple journal entry lines
- Journal entry lines reference accounts from the chart of accounts
- Tax records are linked to companies

## Data Migration Strategy

1. Create initial schema with all tables and relationships
2. Implement seed data for essential lookup tables
3. Create migration scripts for version updates
4. Implement backup and restore functionality

## Data Validation Rules

- All monetary values must have 2 decimal places
- Tax rates must be between 0 and 100
- Dates must be in ISO format (YYYY-MM-DD)
- Invoice numbers must follow a consistent pattern
- Account codes must be unique within a company
- Product codes must be unique within a company
