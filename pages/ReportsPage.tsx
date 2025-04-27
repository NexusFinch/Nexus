'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { BarChart2, PieChart, Download, Filter, Calendar, FileText } from 'lucide-react';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('financial');
  const [timePeriod, setTimePeriod] = useState('month');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <div className="flex space-x-2">
          <select 
            className="border rounded-md px-3 py-2 text-sm"
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
          <button className="border rounded-md px-3 py-2 flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2" />
            Select Dates
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className={`cursor-pointer ${reportType === 'financial' ? 'ring-2 ring-primary' : ''}`}
          onClick={() => setReportType('financial')}
        >
          <CardContent className="p-6 flex items-center">
            <BarChart2 className="h-8 w-8 mr-4 text-primary" />
            <div>
              <h3 className="font-medium">Financial Reports</h3>
              <p className="text-sm text-gray-500">Balance sheet, income statement, cash flow</p>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer ${reportType === 'tax' ? 'ring-2 ring-primary' : ''}`}
          onClick={() => setReportType('tax')}
        >
          <CardContent className="p-6 flex items-center">
            <FileText className="h-8 w-8 mr-4 text-primary" />
            <div>
              <h3 className="font-medium">Tax Reports</h3>
              <p className="text-sm text-gray-500">VAT returns, tax summaries</p>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer ${reportType === 'sales' ? 'ring-2 ring-primary' : ''}`}
          onClick={() => setReportType('sales')}
        >
          <CardContent className="p-6 flex items-center">
            <PieChart className="h-8 w-8 mr-4 text-primary" />
            <div>
              <h3 className="font-medium">Sales Reports</h3>
              <p className="text-sm text-gray-500">Sales by customer, product, period</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {reportType === 'financial' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Financial Reports</CardTitle>
            <div className="flex space-x-2">
              <button className="border rounded-md px-3 py-2 flex items-center text-sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
              <button className="border rounded-md px-3 py-2 flex items-center text-sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h3 className="font-medium">Balance Sheet</h3>
                      <p className="text-sm text-gray-500">Assets, liabilities, and equity</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-primary hover:text-primary-dark text-sm">View</button>
                    <button className="text-gray-500 hover:text-gray-700 text-sm">Download PDF</button>
                    <button className="text-gray-500 hover:text-gray-700 text-sm">Download Excel</button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h3 className="font-medium">Income Statement</h3>
                      <p className="text-sm text-gray-500">Revenue, expenses, and profit</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-primary hover:text-primary-dark text-sm">View</button>
                    <button className="text-gray-500 hover:text-gray-700 text-sm">Download PDF</button>
                    <button className="text-gray-500 hover:text-gray-700 text-sm">Download Excel</button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h3 className="font-medium">Cash Flow Statement</h3>
                      <p className="text-sm text-gray-500">Cash inflows and outflows</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-primary hover:text-primary-dark text-sm">View</button>
                    <button className="text-gray-500 hover:text-gray-700 text-sm">Download PDF</button>
                    <button className="text-gray-500 hover:text-gray-700 text-sm">Download Excel</button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h3 className="font-medium">Trial Balance</h3>
                      <p className="text-sm text-gray-500">Debits and credits for all accounts</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-primary hover:text-primary-dark text-sm">View</button>
                    <button className="text-gray-500 hover:text-gray-700 text-sm">Download PDF</button>
                    <button className="text-gray-500 hover:text-gray-700 text-sm">Download Excel</button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h3 className="font-medium">General Ledger</h3>
                      <p className="text-sm text-gray-500">Detailed account transactions</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-primary hover:text-primary-dark text-sm">View</button>
                    <button className="text-gray-500 hover:text-gray-700 text-sm">Download PDF</button>
                    <button className="text-gray-500 hover:text-gray-700 text-sm">Download Excel</button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {reportType === 'tax' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Tax Reports</CardTitle>
            <div className="flex space-x-2">
              <button className="border rounded-md px-3 py-2 flex items-center text-sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
              <button className="border rounded-md px-3 py-2 flex items-center text-sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h3 className="font-medium">VAT Return</h3>
                      <p className="text-sm text-gray-500">VAT collected and paid</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-primary hover:text-primary-dark text-sm">View</button>
                    <button className="text-gray-500 hover:text-gray-700 text-sm">Download PDF</button>
                    <button className="text-gray-500 hover:text-gray-700 text-sm">Download Excel</button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h3 className="font-medium">Tax Summary</h3>
                      <p className="text-sm text-gray-500">Summary of all taxes</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-primary hover:text-primary-dark text-sm">View</button>
                    <button className="text-gray-500 hover:text-gray-700 text-sm">Download PDF</button>
                    <button className="text-gray-500 hover:text-gray-700 text-sm">Download Excel</button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {reportType === 'sales' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sales Reports</CardTitle>
            <div className="flex space-x-2">
              <button className="border rounded-md px-3 py-2 flex items-center text-sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
              <button className="border rounded-md px-3 py-2 flex items-center text-sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h3 className="font-medium">Sales by Customer</h3>
                      <p className="text-sm text-gray-500">Revenue breakdown by customer</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-primary hover:text-primary-dark text-sm">View</button>
                    <button className="text-gray-500 hover:text-gray-700 text-sm">Download PDF</button>
                    <button className="text-gray-500 hover:text-gray-700 text-sm">Download Excel</button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h3 className="font-medium">Sales by Product</h3>
                      <p className="text-sm text-gray-500">Revenue breakdown by product</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-primary hover:text-primary-dark text-sm">View</button>
                    <button className="text-gray-500 hover:text-gray-700 text-sm">Download PDF</button>
                    <button className="text-gray-500 hover:text-gray-700 text-sm">Download Excel</button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h3 className="font-medium">Sales by Period</h3>
                      <p className="text-sm text-gray-500">Revenue trends over time</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-primary hover:text-primary-dark text-sm">View</button>
                    <button className="text-gray-500 hover:text-gray-700 text-sm">Download PDF</button>
                    <button className="text-gray-500 hover:text-gray-700 text-sm">Download Excel</button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
