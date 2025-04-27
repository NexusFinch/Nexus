-- Migration number: 0001 	 2025-04-22
-- Dubai SME Accounting System Database Schema

-- Drop existing tables if they exist
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS chart_of_accounts;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS warehouses;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS invoice_items;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS journal_entries;
DROP TABLE IF EXISTS journal_entry_lines;
DROP TABLE IF EXISTS tax_records;
DROP TABLE IF EXISTS settings;

-- Create Companies table first (to resolve foreign key references)
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

-- Create Users table
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
    is_active INTEGER DEFAULT 1,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Create Chart of Accounts table
CREATE TABLE chart_of_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    account_code TEXT NOT NULL,
    account_name TEXT NOT NULL,
    account_type TEXT NOT NULL,
    account_category TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    UNIQUE(company_id, account_code)
);

-- Create Products table
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    type TEXT NOT NULL,
    purchase_price REAL,
    sale_price REAL,
    tax_rate REAL,
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    UNIQUE(company_id, code)
);

-- Create Warehouses table
CREATE TABLE warehouses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    location TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Create Inventory table
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

-- Create Customers table
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
    credit_limit REAL,
    payment_terms INTEGER,
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Create Suppliers table
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
    payment_terms INTEGER,
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Create Invoices table
CREATE TABLE invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    invoice_number TEXT NOT NULL,
    invoice_type TEXT NOT NULL,
    customer_id INTEGER,
    supplier_id INTEGER,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status TEXT NOT NULL,
    subtotal REAL NOT NULL,
    tax_amount REAL NOT NULL,
    discount_amount REAL DEFAULT 0,
    total_amount REAL NOT NULL,
    notes TEXT,
    terms TEXT,
    is_recurring INTEGER DEFAULT 0,
    recurrence_pattern TEXT,
    next_recurrence_date DATE,
    e_invoice_status TEXT,
    e_invoice_reference TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    UNIQUE(company_id, invoice_number)
);

-- Create Invoice Items table
CREATE TABLE invoice_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    description TEXT,
    quantity REAL NOT NULL,
    unit_price REAL NOT NULL,
    tax_rate REAL,
    tax_amount REAL,
    discount_percentage REAL DEFAULT 0,
    discount_amount REAL DEFAULT 0,
    total_amount REAL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Create Transactions table
CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    transaction_date DATE NOT NULL,
    transaction_type TEXT NOT NULL,
    reference_number TEXT,
    reference_type TEXT,
    reference_id INTEGER,
    description TEXT,
    amount REAL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Create Journal Entries table
CREATE TABLE journal_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    entry_number TEXT NOT NULL,
    entry_date DATE NOT NULL,
    description TEXT,
    reference TEXT,
    is_posted INTEGER DEFAULT 0,
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    UNIQUE(company_id, entry_number)
);

-- Create Journal Entry Lines table
CREATE TABLE journal_entry_lines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    journal_entry_id INTEGER NOT NULL,
    account_id INTEGER NOT NULL,
    description TEXT,
    debit_amount REAL DEFAULT 0,
    credit_amount REAL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(id),
    FOREIGN KEY (account_id) REFERENCES chart_of_accounts(id)
);

-- Create Tax Records table
CREATE TABLE tax_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    tax_period_start DATE NOT NULL,
    tax_period_end DATE NOT NULL,
    tax_type TEXT NOT NULL,
    tax_amount REAL NOT NULL,
    status TEXT NOT NULL,
    filing_date DATE,
    payment_date DATE,
    reference_number TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Create Settings table
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

-- Create performance indexes
CREATE INDEX idx_invoices_company_date ON invoices(company_id, issue_date);
CREATE INDEX idx_transactions_company_date ON transactions(company_id, transaction_date);
CREATE INDEX idx_journal_entries_company_date ON journal_entries(company_id, entry_date);
CREATE INDEX idx_products_company ON products(company_id);
CREATE INDEX idx_customers_company ON customers(company_id);
CREATE INDEX idx_suppliers_company ON suppliers(company_id);
CREATE INDEX idx_chart_of_accounts_company ON chart_of_accounts(company_id);

-- Insert default admin user
INSERT INTO companies (name, country, base_currency) 
VALUES ('Default Company', 'UAE', 'AED');

INSERT INTO users (email, password_hash, first_name, last_name, role, company_id) 
VALUES ('admin@example.com', '$2a$12$1234567890123456789012uGfLnvRqLkGbQKVXMqTSKHdGpRfmXFO', 'Admin', 'User', 'admin', 1);

-- Insert default chart of accounts for UAE
INSERT INTO chart_of_accounts (company_id, account_code, account_name, account_type, account_category, description)
VALUES 
(1, '1000', 'Cash', 'Asset', 'Current Asset', 'Cash on hand'),
(1, '1100', 'Bank Account', 'Asset', 'Current Asset', 'Main bank account'),
(1, '1200', 'Accounts Receivable', 'Asset', 'Current Asset', 'Amounts owed by customers'),
(1, '1300', 'Inventory', 'Asset', 'Current Asset', 'Goods for sale'),
(1, '1400', 'Prepaid Expenses', 'Asset', 'Current Asset', 'Expenses paid in advance'),
(1, '1500', 'Fixed Assets', 'Asset', 'Non-Current Asset', 'Long-term assets'),
(1, '1600', 'Accumulated Depreciation', 'Asset', 'Non-Current Asset', 'Accumulated depreciation of fixed assets'),
(1, '2000', 'Accounts Payable', 'Liability', 'Current Liability', 'Amounts owed to suppliers'),
(1, '2100', 'Accrued Expenses', 'Liability', 'Current Liability', 'Expenses incurred but not yet paid'),
(1, '2200', 'VAT Payable', 'Liability', 'Current Liability', 'VAT collected but not yet paid to authorities'),
(1, '2300', 'VAT Receivable', 'Asset', 'Current Asset', 'VAT paid that can be reclaimed'),
(1, '2400', 'Loans Payable', 'Liability', 'Non-Current Liability', 'Long-term loans'),
(1, '3000', 'Owner''s Equity', 'Equity', 'Equity', 'Owner''s investment in the business'),
(1, '3100', 'Retained Earnings', 'Equity', 'Equity', 'Accumulated profits or losses'),
(1, '4000', 'Sales Revenue', 'Revenue', 'Income', 'Income from sales'),
(1, '4100', 'Service Revenue', 'Revenue', 'Income', 'Income from services'),
(1, '4200', 'Other Income', 'Revenue', 'Income', 'Miscellaneous income'),
(1, '5000', 'Cost of Goods Sold', 'Expense', 'Cost of Sales', 'Cost of items sold'),
(1, '6000', 'Salaries Expense', 'Expense', 'Operating Expense', 'Employee salaries'),
(1, '6100', 'Rent Expense', 'Expense', 'Operating Expense', 'Office or warehouse rent'),
(1, '6200', 'Utilities Expense', 'Expense', 'Operating Expense', 'Electricity, water, internet'),
(1, '6300', 'Office Supplies Expense', 'Expense', 'Operating Expense', 'Office consumables'),
(1, '6400', 'Depreciation Expense', 'Expense', 'Operating Expense', 'Depreciation of fixed assets'),
(1, '6500', 'Insurance Expense', 'Expense', 'Operating Expense', 'Business insurance'),
(1, '6600', 'Advertising Expense', 'Expense', 'Operating Expense', 'Marketing and advertising'),
(1, '7000', 'Interest Expense', 'Expense', 'Financial Expense', 'Interest on loans'),
(1, '7100', 'Bank Charges', 'Expense', 'Financial Expense', 'Bank fees and charges'),
(1, '8000', 'Tax Expense', 'Expense', 'Tax Expense', 'Corporate and other taxes');

-- Insert default settings
INSERT INTO settings (company_id, setting_key, setting_value)
VALUES 
(1, 'invoice_prefix', 'INV-'),
(1, 'next_invoice_number', '0001'),
(1, 'fiscal_year_start', '01-01'),
(1, 'default_payment_terms', '30'),
(1, 'default_tax_rate', '5'),
(1, 'currency_format', 'AED #,##0.00'),
(1, 'date_format', 'DD/MM/YYYY'),
(1, 'default_language', 'en');
