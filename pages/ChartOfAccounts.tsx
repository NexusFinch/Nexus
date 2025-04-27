'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { BookOpen, Plus, Search, Filter, Download, FileText } from 'lucide-react';

export default function ChartOfAccounts() {
  const [filterType, setFilterType] = useState('all');
  
  // Mock data for accounts - in a real implementation this would come from an API
  const accounts = [
    {
      id: 1,
      code: '1000',
      name: 'Cash',
      type: 'Asset',
      category: 'Current Asset',
      balance: 45000.00,
      description: 'Cash on hand',
    },
    {
      id: 2,
      code: '1100',
      name: 'Bank Account',
      type: 'Asset',
      category: 'Current Asset',
      balance: 125000.00,
      description: 'Main bank account',
    },
    {
      id: 3,
      code: '1200',
      name: 'Accounts Receivable',
      type: 'Asset',
      category: 'Current Asset',
      balance: 35000.00,
      description: 'Amounts owed by customers',
    },
    {
      id: 4,
      code: '2000',
      name: 'Accounts Payable',
      type: 'Liability',
      category: 'Current Liability',
      balance: 28000.00,
      description: 'Amounts owed to suppliers',
    },
    {
      id: 5,
      code: '2200',
      name: 'VAT Payable',
      type: 'Liability',
      category: 'Current Liability',
      balance: 12500.00,
      description: 'VAT collected but not yet paid to authorities',
    },
    {
      id: 6,
      code: '4000',
      name: 'Sales Revenue',
      type: 'Revenue',
      category: 'Income',
      balance: 180000.00,
      description: 'Income from sales',
    },
    {
      id: 7,
      code: '5000',
      name: 'Cost of Goods Sold',
      type: 'Expense',
      category: 'Cost of Sales',
      balance: 95000.00,
      description: 'Cost of items sold',
    },
  ];

  const filteredAccounts = filterType === 'all' 
    ? accounts 
    : accounts.filter(account => account.type.toLowerCase() === filterType.toLowerCase());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Chart of Accounts</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-md flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          New Account
        </button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Accounts</CardTitle>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search accounts..." 
                className="pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button className="border rounded-md px-3 py-2 flex items-center text-sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            <button className="border rounded-md px-3 py-2 flex items-center text-sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button className="border rounded-md px-3 py-2 flex items-center text-sm">
              <FileText className="h-4 w-4 mr-2" />
              Report
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex space-x-2">
            <button 
              className={`px-3 py-1 rounded-full text-sm ${filterType === 'all' ? 'bg-primary text-white' : 'bg-gray-100'}`}
              onClick={() => setFilterType('all')}
            >
              All
            </button>
            <button 
              className={`px-3 py-1 rounded-full text-sm ${filterType === 'asset' ? 'bg-primary text-white' : 'bg-gray-100'}`}
              onClick={() => setFilterType('asset')}
            >
              Assets
            </button>
            <button 
              className={`px-3 py-1 rounded-full text-sm ${filterType === 'liability' ? 'bg-primary text-white' : 'bg-gray-100'}`}
              onClick={() => setFilterType('liability')}
            >
              Liabilities
            </button>
            <button 
              className={`px-3 py-1 rounded-full text-sm ${filterType === 'equity' ? 'bg-primary text-white' : 'bg-gray-100'}`}
              onClick={() => setFilterType('equity')}
            >
              Equity
            </button>
            <button 
              className={`px-3 py-1 rounded-full text-sm ${filterType === 'revenue' ? 'bg-primary text-white' : 'bg-gray-100'}`}
              onClick={() => setFilterType('revenue')}
            >
              Revenue
            </button>
            <button 
              className={`px-3 py-1 rounded-full text-sm ${filterType === 'expense' ? 'bg-primary text-white' : 'bg-gray-100'}`}
              onClick={() => setFilterType('expense')}
            >
              Expenses
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Code</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Account Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Category</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Balance</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Description</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((account) => (
                  <tr key={account.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium">{account.code}</td>
                    <td className="px-4 py-4 text-sm font-medium text-primary">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                        {account.name}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm">{account.type}</td>
                    <td className="px-4 py-4 text-sm">{account.category}</td>
                    <td className="px-4 py-4 text-sm text-right">AED {account.balance.toFixed(2)}</td>
                    <td className="px-4 py-4 text-sm">{account.description}</td>
                    <td className="px-4 py-4 text-sm text-right">
                      <button className="text-primary hover:text-primary-dark mr-2">View</button>
                      <button className="text-gray-500 hover:text-gray-700 mr-2">Edit</button>
                      <button className="text-gray-500 hover:text-gray-700">More</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {filteredAccounts.length} of {accounts.length} accounts
            </div>
            <div className="flex space-x-1">
              <button className="px-3 py-1 border rounded-md text-sm">Previous</button>
              <button className="px-3 py-1 bg-primary text-white rounded-md text-sm">1</button>
              <button className="px-3 py-1 border rounded-md text-sm">Next</button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
