'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Package, Plus, Search, Filter, ArrowUpDown, BarChart2 } from 'lucide-react';

export default function ProductList() {
  const [filterCategory, setFilterCategory] = useState('all');
  
  // Mock data for products - in a real implementation this would come from an API
  const products = [
    {
      id: 'PRD-001',
      code: 'ELEC-001',
      name: 'Laptop Computer',
      category: 'Electronics',
      type: 'inventory',
      purchasePrice: 2500.00,
      salePrice: 3200.00,
      stockLevel: 15,
      status: 'active',
    },
    {
      id: 'PRD-002',
      code: 'FURN-001',
      name: 'Office Desk',
      category: 'Furniture',
      type: 'inventory',
      purchasePrice: 450.00,
      salePrice: 750.00,
      stockLevel: 8,
      status: 'active',
    },
    {
      id: 'PRD-003',
      code: 'SUPP-001',
      name: 'Printer Paper',
      category: 'Office Supplies',
      type: 'inventory',
      purchasePrice: 15.00,
      salePrice: 25.00,
      stockLevel: 120,
      status: 'active',
    },
    {
      id: 'PRD-004',
      code: 'SERV-001',
      name: 'IT Consultation',
      category: 'Services',
      type: 'service',
      purchasePrice: 0,
      salePrice: 150.00,
      stockLevel: null,
      status: 'active',
    },
    {
      id: 'PRD-005',
      code: 'ELEC-002',
      name: 'Smartphone',
      category: 'Electronics',
      type: 'inventory',
      purchasePrice: 1200.00,
      salePrice: 1800.00,
      stockLevel: 5,
      status: 'low_stock',
    },
  ];

  const filteredProducts = filterCategory === 'all' 
    ? products 
    : products.filter(product => product.category.toLowerCase() === filterCategory.toLowerCase());

  const getStockLevelClass = (product: any) => {
    if (product.type === 'service') return '';
    
    if (product.stockLevel === 0) {
      return 'bg-red-100 text-red-800';
    } else if (product.status === 'low_stock') {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Inventory Management</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-md flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Products</CardTitle>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search products..." 
                className="pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button className="border rounded-md px-3 py-2 flex items-center text-sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            <button className="border rounded-md px-3 py-2 flex items-center text-sm">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Sort
            </button>
            <button className="border rounded-md px-3 py-2 flex items-center text-sm">
              <BarChart2 className="h-4 w-4 mr-2" />
              Reports
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex space-x-2">
            <button 
              className={`px-3 py-1 rounded-full text-sm ${filterCategory === 'all' ? 'bg-primary text-white' : 'bg-gray-100'}`}
              onClick={() => setFilterCategory('all')}
            >
              All
            </button>
            <button 
              className={`px-3 py-1 rounded-full text-sm ${filterCategory === 'electronics' ? 'bg-primary text-white' : 'bg-gray-100'}`}
              onClick={() => setFilterCategory('electronics')}
            >
              Electronics
            </button>
            <button 
              className={`px-3 py-1 rounded-full text-sm ${filterCategory === 'furniture' ? 'bg-primary text-white' : 'bg-gray-100'}`}
              onClick={() => setFilterCategory('furniture')}
            >
              Furniture
            </button>
            <button 
              className={`px-3 py-1 rounded-full text-sm ${filterCategory === 'office supplies' ? 'bg-primary text-white' : 'bg-gray-100'}`}
              onClick={() => setFilterCategory('office supplies')}
            >
              Office Supplies
            </button>
            <button 
              className={`px-3 py-1 rounded-full text-sm ${filterCategory === 'services' ? 'bg-primary text-white' : 'bg-gray-100'}`}
              onClick={() => setFilterCategory('services')}
            >
              Services
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Product</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Code</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Type</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Purchase Price</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Sale Price</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Stock Level</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium text-primary">
                      <div className="flex items-center">
                        <Package className="h-4 w-4 mr-2 text-gray-400" />
                        {product.name}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm">{product.code}</td>
                    <td className="px-4 py-4 text-sm">{product.category}</td>
                    <td className="px-4 py-4 text-sm capitalize">{product.type}</td>
                    <td className="px-4 py-4 text-sm text-right">
                      {product.purchasePrice > 0 ? `AED ${product.purchasePrice.toFixed(2)}` : '-'}
                    </td>
                    <td className="px-4 py-4 text-sm text-right">AED {product.salePrice.toFixed(2)}</td>
                    <td className="px-4 py-4 text-sm text-center">
                      {product.type === 'service' ? (
                        <span className="text-gray-500">N/A</span>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStockLevelClass(product)}`}>
                          {product.stockLevel}
                        </span>
                      )}
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
              Showing {filteredProducts.length} of {products.length} products
            </div>
            <div className="flex space-x-1">
              <button className="px-3 py-1 border rounded-md text-sm">Previous</button>
              <button className="px-3 py-1 bg-primary text-white rounded-md text-sm">1</button>
              <button className="px-3 py-1 border rounded-md text-sm">2</button>
              <button className="px-3 py-1 border rounded-md text-sm">Next</button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
