'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
  BarChart2, 
  DollarSign, 
  Users, 
  Settings,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

export default function Sidebar() {
  const [openMenus, setOpenMenus] = useState({
    invoices: false,
    inventory: false,
    accounting: false
  });

  const toggleMenu = (menu: keyof typeof openMenus) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  return (
    <aside className="w-64 bg-white shadow-md hidden md:block">
      <div className="h-full flex flex-col">
        <div className="p-4">
          <div className="text-sm font-medium text-gray-500">Company</div>
          <div className="text-base font-semibold text-gray-900">Default Company</div>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1 px-2">
            <li>
              <Link href="/dashboard" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-900 bg-gray-100">
                <LayoutDashboard className="mr-3 h-5 w-5 text-primary" />
                Dashboard
              </Link>
            </li>
            
            {/* Invoices Section */}
            <li>
              <button 
                onClick={() => toggleMenu('invoices')}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <div className="flex items-center">
                  <FileText className="mr-3 h-5 w-5 text-gray-400" />
                  Invoices
                </div>
                {openMenus.invoices ? 
                  <ChevronDown className="h-4 w-4" /> : 
                  <ChevronRight className="h-4 w-4" />
                }
              </button>
              {openMenus.invoices && (
                <ul className="mt-1 pl-10 space-y-1">
                  <li>
                    <Link href="/invoices/sales" className="block px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                      Sales Invoices
                    </Link>
                  </li>
                  <li>
                    <Link href="/invoices/purchases" className="block px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                      Purchase Invoices
                    </Link>
                  </li>
                  <li>
                    <Link href="/invoices/recurring" className="block px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                      Recurring Invoices
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            
            {/* Inventory Section */}
            <li>
              <button 
                onClick={() => toggleMenu('inventory')}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <div className="flex items-center">
                  <Package className="mr-3 h-5 w-5 text-gray-400" />
                  Inventory
                </div>
                {openMenus.inventory ? 
                  <ChevronDown className="h-4 w-4" /> : 
                  <ChevronRight className="h-4 w-4" />
                }
              </button>
              {openMenus.inventory && (
                <ul className="mt-1 pl-10 space-y-1">
                  <li>
                    <Link href="/inventory/products" className="block px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link href="/inventory/stock" className="block px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                      Stock Levels
                    </Link>
                  </li>
                  <li>
                    <Link href="/inventory/warehouses" className="block px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                      Warehouses
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            
            {/* Accounting Section */}
            <li>
              <button 
                onClick={() => toggleMenu('accounting')}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <div className="flex items-center">
                  <DollarSign className="mr-3 h-5 w-5 text-gray-400" />
                  Accounting
                </div>
                {openMenus.accounting ? 
                  <ChevronDown className="h-4 w-4" /> : 
                  <ChevronRight className="h-4 w-4" />
                }
              </button>
              {openMenus.accounting && (
                <ul className="mt-1 pl-10 space-y-1">
                  <li>
                    <Link href="/accounting/chart-of-accounts" className="block px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                      Chart of Accounts
                    </Link>
                  </li>
                  <li>
                    <Link href="/accounting/journal-entries" className="block px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                      Journal Entries
                    </Link>
                  </li>
                  <li>
                    <Link href="/accounting/vat" className="block px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                      VAT Management
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            
            <li>
              <Link href="/reports" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                <BarChart2 className="mr-3 h-5 w-5 text-gray-400" />
                Reports
              </Link>
            </li>
            
            <li>
              <Link href="/contacts" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                <Users className="mr-3 h-5 w-5 text-gray-400" />
                Contacts
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <Link href="/settings" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
            <Settings className="mr-3 h-5 w-5 text-gray-400" />
            Settings
          </Link>
        </div>
      </div>
    </aside>
  );
}
