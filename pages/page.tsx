'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Layout from '../components/layout/Layout';
import DashboardPage from '../components/dashboard/DashboardPage';
import InvoiceList from '../components/invoices/InvoiceList';
import ProductList from '../components/inventory/ProductList';
import ChartOfAccounts from '../components/accounting/ChartOfAccounts';
import ReportsPage from '../components/reports/ReportsPage';

export default function Page() {
  const pathname = usePathname();
  
  const renderContent = () => {
    switch (pathname) {
      case '/':
      case '/dashboard':
        return <DashboardPage />;
      case '/invoices':
        return <InvoiceList />;
      case '/inventory':
        return <ProductList />;
      case '/accounting':
        return <ChartOfAccounts />;
      case '/reports':
        return <ReportsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <Layout>
      {renderContent()}
    </Layout>
  );
}
