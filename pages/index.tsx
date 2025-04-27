import React, { useState } from 'react';
import Head from 'next/head';

// Components
const Header = () => (
  <header className="bg-white shadow">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-primary">Dubai SME Accounting System</h1>
      </div>
      <div className="flex items-center">
        <div className="ml-4 flex items-center md:ml-6">
          <button className="bg-gray-100 p-1 rounded-full text-gray-600 hover:text-gray-800 focus:outline-none">
            <span className="sr-only">View notifications</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <div className="ml-3 relative">
            <div>
              <button className="max-w-xs bg-gray-100 rounded-full flex items-center text-sm focus:outline-none p-1">
                <span className="sr-only">Open user menu</span>
                <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
);

const Sidebar = () => (
  <div className="hidden md:block md:w-64 bg-white shadow-md">
    <div className="h-full flex flex-col">
      <nav className="flex-1 px-2 py-4 space-y-1">
        <a href="#" className="bg-primary text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
          <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Dashboard
        </a>
        <a href="#" className="text-gray-600 hover:bg-gray-100 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
          <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Invoices
        </a>
        <a href="#" className="text-gray-600 hover:bg-gray-100 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
          <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Inventory
        </a>
        <a href="#" className="text-gray-600 hover:bg-gray-100 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
          <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Accounting
        </a>
        <a href="#" className="text-gray-600 hover:bg-gray-100 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
          <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Reports
        </a>
        <a href="#" className="text-gray-600 hover:bg-gray-100 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
          <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </a>
      </nav>
    </div>
  </div>
);

const Dashboard = () => {
  // Mock data for dashboard
  const invoiceStats = {
    total: 24,
    paid: 18,
    pending: 4,
    overdue: 2
  };

  const inventoryStats = {
    totalValue: 125000,
    totalProducts: 45,
    lowStockCount: 3
  };

  const recentInvoices = [
    { id: 1, invoiceNumber: 'INV-2025-001', customerName: 'Al Futtaim Group', issueDate: '2025-04-15', totalAmount: 5200, status: 'paid' },
    { id: 2, invoiceNumber: 'INV-2025-002', customerName: 'Emaar Properties', issueDate: '2025-04-18', totalAmount: 3750, status: 'pending' },
    { id: 3, invoiceNumber: 'INV-2025-003', customerName: 'Dubai Holding', issueDate: '2025-04-10', totalAmount: 8900, status: 'paid' },
    { id: 4, invoiceNumber: 'INV-2025-004', customerName: 'Majid Al Futtaim', issueDate: '2025-04-05', totalAmount: 4200, status: 'overdue' }
  ];

  const lowStockItems = [
    { id: 1, productName: 'Office Desk', warehouseName: 'Main Warehouse', quantityOnHand: 2, reorderLevel: 5 },
    { id: 2, productName: 'Ergonomic Chair', warehouseName: 'Main Warehouse', quantityOnHand: 3, reorderLevel: 10 },
    { id: 3, productName: 'Laptop Stand', warehouseName: 'Electronics Store', quantityOnHand: 4, reorderLevel: 15 }
  ];

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'paid':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'overdue':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Total Invoices</h3>
          <p className="text-3xl font-bold text-primary mt-2">{invoiceStats.total}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Pending Invoices</h3>
          <p className="text-3xl font-bold text-yellow-500 mt-2">{invoiceStats.pending}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Overdue Invoices</h3>
          <p className="text-3xl font-bold text-red-500 mt-2">{invoiceStats.overdue}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Inventory Value</h3>
          <p className="text-3xl font-bold text-green-500 mt-2">AED {inventoryStats.totalValue.toLocaleString()}</p>
        </div>
      </div>
      
      {/* Recent Invoices */}
      <div className="card">
        <h2 className="text-lg font-medium mb-4">Recent Invoices</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Customer</th>
                <th>Date</th>
                <th className="text-right">Amount</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="font-medium text-primary">{invoice.invoiceNumber}</td>
                  <td>{invoice.customerName}</td>
                  <td>{invoice.issueDate}</td>
                  <td className="text-right">AED {invoice.totalAmount.toLocaleString()}</td>
                  <td className="text-center">
                    <span className={`badge ${getStatusBadgeClass(invoice.status)} capitalize`}>
                      {invoice.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Low Stock Items */}
      <div className="card">
        <h2 className="text-lg font-medium mb-4">Low Stock Items</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Warehouse</th>
                <th className="text-center">Current Stock</th>
                <th className="text-center">Reorder Level</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="font-medium">{item.productName}</td>
                  <td>{item.warehouseName}</td>
                  <td className="text-center">
                    <span className="badge badge-danger">
                      {item.quantityOnHand}
                    </span>
                  </td>
                  <td className="text-center">{item.reorderLevel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Please enter both email and password');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Head>
          <title>Dubai SME Accounting System - Login</title>
          <meta name="description" content="Dubai SME Accounting System Demo" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-primary">Dubai SME Accounting System</h1>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="your@email.com"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="#" className="text-primary hover:text-primary-dark">
                Register
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Dubai SME Accounting System - Dashboard</title>
        <meta name="description" content="Dubai SME Accounting System Demo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}
