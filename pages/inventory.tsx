import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function InventoryPage() {
  // Mock data for products
  const products = [
    { id: 1, code: 'P001', name: 'Office Desk', category: 'Furniture', quantity: 2, reorderLevel: 5, unitPrice: 1200, value: 2400 },
    { id: 2, code: 'P002', name: 'Ergonomic Chair', category: 'Furniture', quantity: 3, reorderLevel: 10, unitPrice: 850, value: 2550 },
    { id: 3, code: 'P003', name: 'Laptop Stand', category: 'Electronics', quantity: 4, reorderLevel: 15, unitPrice: 120, value: 480 },
    { id: 4, code: 'P004', name: 'Wireless Mouse', category: 'Electronics', quantity: 25, reorderLevel: 20, unitPrice: 75, value: 1875 },
    { id: 5, code: 'P005', name: 'Wireless Keyboard', category: 'Electronics', quantity: 18, reorderLevel: 15, unitPrice: 150, value: 2700 },
    { id: 6, code: 'P006', name: 'Monitor 24"', category: 'Electronics', quantity: 12, reorderLevel: 8, unitPrice: 950, value: 11400 },
    { id: 7, code: 'P007', name: 'Filing Cabinet', category: 'Furniture', quantity: 7, reorderLevel: 5, unitPrice: 450, value: 3150 },
    { id: 8, code: 'P008', name: 'Desk Lamp', category: 'Accessories', quantity: 15, reorderLevel: 10, unitPrice: 85, value: 1275 }
  ];

  const getStockStatusClass = (quantity, reorderLevel) => {
    if (quantity <= reorderLevel * 0.5) {
      return 'badge-danger';
    } else if (quantity <= reorderLevel) {
      return 'badge-warning';
    } else {
      return 'badge-success';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Dubai SME Accounting System - Inventory</title>
        <meta name="description" content="Dubai SME Accounting System Demo - Inventory" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-xl font-bold text-primary cursor-pointer">Dubai SME Accounting System</h1>
            </Link>
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

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:block md:w-64 bg-white shadow-md">
          <div className="h-full flex flex-col">
            <nav className="flex-1 px-2 py-4 space-y-1">
              <Link href="/">
                <a className="text-gray-600 hover:bg-gray-100 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </a>
              </Link>
              <Link href="/invoices">
                <a className="text-gray-600 hover:bg-gray-100 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Invoices
                </a>
              </Link>
              <a href="#" className="bg-primary text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
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

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold tracking-tight">Inventory Management</h1>
              <button className="btn-primary">
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Product
                </span>
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card">
                <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
                <p className="text-3xl font-bold text-primary mt-2">8</p>
              </div>
              <div className="card">
                <h3 className="text-sm font-medium text-gray-500">Low Stock Items</h3>
                <p className="text-3xl font-bold text-yellow-500 mt-2">3</p>
              </div>
              <div className="card">
                <h3 className="text-sm font-medium text-gray-500">Total Inventory Value</h3>
                <p className="text-3xl font-bold text-green-500 mt-2">AED 25,830</p>
              </div>
            </div>

            {/* Filters */}
            <div className="card">
              <div className="flex flex-wrap gap-4">
                <div className="w-full md:w-auto">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select id="category" className="input">
                    <option value="">All Categories</option>
                    <option value="furniture">Furniture</option>
                    <option value="electronics">Electronics</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <div className="w-full md:w-auto">
                  <label htmlFor="stock-status" className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
                  <select id="stock-status" className="input">
                    <option value="all">All</option>
                    <option value="in-stock">In Stock</option>
                    <option value="low-stock">Low Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>
                <div className="w-full md:w-auto">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <input type="text" id="search" className="input" placeholder="Search products..." />
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="card">
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th className="text-center">Quantity</th>
                      <th className="text-center">Reorder Level</th>
                      <th className="text-right">Unit Price</th>
                      <th className="text-right">Value</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="font-medium text-primary">{product.code}</td>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td className="text-center">
                          <span className={`badge ${getStockStatusClass(product.quantity, product.reorderLevel)}`}>
                            {product.quantity}
                          </span>
                        </td>
                        <td className="text-center">{product.reorderLevel}</td>
                        <td className="text-right">AED {product.unitPrice.toLocaleString()}</td>
                        <td className="text-right">AED {product.value.toLocaleString()}</td>
                        <td className="text-right">
                          <div className="flex justify-end space-x-2">
                            <button className="p-1 text-gray-500 hover:text-primary">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button className="p-1 text-gray-500 hover:text-primary">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button className="p-1 text-gray-500 hover:text-danger">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of <span className="font-medium">8</span> results
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-500 hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-500 hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
