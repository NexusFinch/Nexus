'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, LineChart, PieChart } from '../ui/charts';
import { 
  DollarSign, 
  ShoppingCart, 
  CreditCard, 
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export default function Dashboard() {
  // This would be fetched from the API in a real implementation
  const dashboardData = {
    totalRevenue: 'AED 124,750.00',
    revenueChange: '+12.5%',
    totalExpenses: 'AED 78,230.00',
    expensesChange: '+5.2%',
    accountsReceivable: 'AED 45,320.00',
    accountsPayable: 'AED 32,150.00',
    lowStockItems: 8,
    overdueInvoices: 5
  };

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [30000, 35000, 28000, 42000, 38000, 48000],
        backgroundColor: '#1E40AF',
        borderColor: '#1E40AF',
      },
      {
        label: 'Expenses',
        data: [22000, 25000, 20000, 28000, 26000, 32000],
        backgroundColor: '#EF4444',
        borderColor: '#EF4444',
      }
    ]
  };

  const invoiceStatusData = {
    labels: ['Paid', 'Pending', 'Overdue'],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
        borderWidth: 0,
      }
    ]
  };

  const inventoryData = {
    labels: ['Electronics', 'Furniture', 'Office Supplies', 'Stationery', 'Other'],
    datasets: [
      {
        label: 'Stock Value',
        data: [45000, 32000, 18000, 12000, 8000],
        backgroundColor: [
          '#1E40AF',
          '#10B981',
          '#F59E0B',
          '#6366F1',
          '#8B5CF6'
        ],
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <select className="border rounded-md px-3 py-1.5 text-sm">
            <option>Last 30 Days</option>
            <option>This Month</option>
            <option>Last Quarter</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-bold mt-1">{dashboardData.totalRevenue}</h3>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">{dashboardData.revenueChange}</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                <h3 className="text-2xl font-bold mt-1">{dashboardData.totalExpenses}</h3>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">{dashboardData.expensesChange}</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Accounts Receivable</p>
                <h3 className="text-2xl font-bold mt-1">{dashboardData.accountsReceivable}</h3>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-500">{dashboardData.overdueInvoices} overdue</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
                <h3 className="text-2xl font-bold mt-1">{dashboardData.lowStockItems}</h3>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-500">Need attention</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <BarChart data={revenueData} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <PieChart data={invoiceStatusData} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">Invoice #INV-2025-042</p>
                <p className="text-sm text-gray-500">Created for Customer XYZ</p>
              </div>
              <div className="text-right">
                <p className="font-medium">AED 4,500.00</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">Payment Received</p>
                <p className="text-sm text-gray-500">From Customer ABC</p>
              </div>
              <div className="text-right">
                <p className="font-medium">AED 12,750.00</p>
                <p className="text-sm text-gray-500">Yesterday</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">Stock Alert</p>
                <p className="text-sm text-gray-500">Product XYZ below threshold</p>
              </div>
              <div className="text-right">
                <p className="font-medium">5 units remaining</p>
                <p className="text-sm text-gray-500">Yesterday</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">VAT Return Due</p>
                <p className="text-sm text-gray-500">Q2 2025 filing deadline</p>
              </div>
              <div className="text-right">
                <p className="font-medium">15 days remaining</p>
                <p className="text-sm text-gray-500">Action required</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
