'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { FileText, Plus, Search, Filter, Download, Printer } from 'lucide-react';

export default function InvoiceList() {
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Mock data for invoices - in a real implementation this would come from an API
  const invoices = [
    {
      id: 'INV-2025-001',
      customer: 'ABC Trading LLC',
      issueDate: '2025-04-10',
      dueDate: '2025-05-10',
      amount: 12500.00,
      status: 'paid',
    },
    {
      id: 'INV-2025-002',
      customer: 'Dubai Tech Solutions',
      issueDate: '2025-04-12',
      dueDate: '2025-05-12',
      amount: 8750.50,
      status: 'pending',
    },
    {
      id: 'INV-2025-003',
      customer: 'Gulf Enterprises',
      issueDate: '2025-04-15',
      dueDate: '2025-05-15',
      amount: 15200.75,
      status: 'overdue',
    },
    {
      id: 'INV-2025-004',
      customer: 'Sharjah Imports',
      issueDate: '2025-04-18',
      dueDate: '2025-05-18',
      amount: 6300.25,
      status: 'draft',
    },
    {
      id: 'INV-2025-005',
      customer: 'Abu Dhabi Services',
      issueDate: '2025-04-20',
      dueDate: '2025-05-20',
      amount: 9800.00,
      status: 'pending',
    },
  ];

  const filteredInvoices = filterStatus === 'all' 
    ? invoices 
    : invoices.filter(invoice => invoice.status === filterStatus);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-md flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          New Invoice
        </button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Sales Invoices</CardTitle>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search invoices..." 
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
              <Printer className="h-4 w-4 mr-2" />
              Print
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex space-x-2">
            <button 
              className={`px-3 py-1 rounded-full text-sm ${filterStatus === 'all' ? 'bg-primary text-white' : 'bg-gray-100'}`}
              onClick={() => setFilterStatus('all')}
            >
              All
            </button>
            <button 
              className={`px-3 py-1 rounded-full text-sm ${filterStatus === 'draft' ? 'bg-primary text-white' : 'bg-gray-100'}`}
              onClick={() => setFilterStatus('draft')}
            >
              Draft
            </button>
            <button 
              className={`px-3 py-1 rounded-full text-sm ${filterStatus === 'pending' ? 'bg-primary text-white' : 'bg-gray-100'}`}
              onClick={() => setFilterStatus('pending')}
            >
              Pending
            </button>
            <button 
              className={`px-3 py-1 rounded-full text-sm ${filterStatus === 'paid' ? 'bg-primary text-white' : 'bg-gray-100'}`}
              onClick={() => setFilterStatus('paid')}
            >
              Paid
            </button>
            <button 
              className={`px-3 py-1 rounded-full text-sm ${filterStatus === 'overdue' ? 'bg-primary text-white' : 'bg-gray-100'}`}
              onClick={() => setFilterStatus('overdue')}
            >
              Overdue
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Invoice #</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Issue Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Due Date</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Amount</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium text-primary">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-gray-400" />
                        {invoice.id}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm">{invoice.customer}</td>
                    <td className="px-4 py-4 text-sm">{invoice.issueDate}</td>
                    <td className="px-4 py-4 text-sm">{invoice.dueDate}</td>
                    <td className="px-4 py-4 text-sm text-right">AED {invoice.amount.toFixed(2)}</td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadgeClass(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
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
              Showing {filteredInvoices.length} of {invoices.length} invoices
            </div>
            <div className="flex space-x-1">
              <button className="px-3 py-1 border rounded-md text-sm">Previous</button>
              <button className="px-3 py-1 bg-primary text-white rounded-md text-sm">1</button>
              <button className="px-3 py-1 border rounded-md text-sm">2</button>
              <button className="px-3 py-1 border rounded-md text-sm">3</button>
              <button className="px-3 py-1 border rounded-md text-sm">Next</button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
