import { D1Database } from '@cloudflare/workers-types';

export interface Invoice {
  id: number;
  companyId: number;
  invoiceNumber: string;
  invoiceType: 'sales' | 'purchase';
  customerId?: number;
  supplierId?: number;
  issueDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  notes?: string;
  terms?: string;
  isRecurring: boolean;
  recurrencePattern?: string;
  nextRecurrenceDate?: string;
  eInvoiceStatus?: 'not_applicable' | 'pending' | 'sent' | 'failed';
  eInvoiceReference?: string;
}

export interface InvoiceItem {
  id: number;
  invoiceId: number;
  productId: number;
  description?: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number;
  taxAmount?: number;
  discountPercentage?: number;
  discountAmount?: number;
  totalAmount: number;
}

export class InvoiceService {
  constructor(private db: D1Database) {}

  async getInvoices(companyId: number, type?: 'sales' | 'purchase'): Promise<Invoice[]> {
    let query = `
      SELECT 
        id, 
        company_id as companyId, 
        invoice_number as invoiceNumber, 
        invoice_type as invoiceType, 
        customer_id as customerId, 
        supplier_id as supplierId, 
        issue_date as issueDate, 
        due_date as dueDate, 
        status, 
        subtotal, 
        tax_amount as taxAmount, 
        discount_amount as discountAmount, 
        total_amount as totalAmount, 
        notes, 
        terms, 
        is_recurring as isRecurring, 
        recurrence_pattern as recurrencePattern, 
        next_recurrence_date as nextRecurrenceDate, 
        e_invoice_status as eInvoiceStatus, 
        e_invoice_reference as eInvoiceReference 
      FROM invoices 
      WHERE company_id = ?
    `;
    
    const params = [companyId];
    
    if (type) {
      query += ' AND invoice_type = ?';
      params.push(type);
    }
    
    query += ' ORDER BY issue_date DESC';
    
    const { results } = await this.db.prepare(query)
      .bind(...params)
      .all();
    
    return results.map(invoice => ({
      ...invoice,
      isRecurring: !!invoice.isRecurring
    })) as Invoice[];
  }

  async getInvoiceById(id: number): Promise<Invoice | null> {
    const { results } = await this.db.prepare(
      `SELECT 
        id, 
        company_id as companyId, 
        invoice_number as invoiceNumber, 
        invoice_type as invoiceType, 
        customer_id as customerId, 
        supplier_id as supplierId, 
        issue_date as issueDate, 
        due_date as dueDate, 
        status, 
        subtotal, 
        tax_amount as taxAmount, 
        discount_amount as discountAmount, 
        total_amount as totalAmount, 
        notes, 
        terms, 
        is_recurring as isRecurring, 
        recurrence_pattern as recurrencePattern, 
        next_recurrence_date as nextRecurrenceDate, 
        e_invoice_status as eInvoiceStatus, 
        e_invoice_reference as eInvoiceReference 
      FROM invoices 
      WHERE id = ?`
    )
    .bind(id)
    .all();
    
    if (results.length === 0) {
      return null;
    }
    
    const invoice = results[0] as any;
    return {
      ...invoice,
      isRecurring: !!invoice.isRecurring
    } as Invoice;
  }

  async getInvoiceByNumber(companyId: number, invoiceNumber: string): Promise<Invoice | null> {
    const { results } = await this.db.prepare(
      `SELECT 
        id, 
        company_id as companyId, 
        invoice_number as invoiceNumber, 
        invoice_type as invoiceType, 
        customer_id as customerId, 
        supplier_id as supplierId, 
        issue_date as issueDate, 
        due_date as dueDate, 
        status, 
        subtotal, 
        tax_amount as taxAmount, 
        discount_amount as discountAmount, 
        total_amount as totalAmount, 
        notes, 
        terms, 
        is_recurring as isRecurring, 
        recurrence_pattern as recurrencePattern, 
        next_recurrence_date as nextRecurrenceDate, 
        e_invoice_status as eInvoiceStatus, 
        e_invoice_reference as eInvoiceReference 
      FROM invoices 
      WHERE company_id = ? AND invoice_number = ?`
    )
    .bind(companyId, invoiceNumber)
    .all();
    
    if (results.length === 0) {
      return null;
    }
    
    const invoice = results[0] as any;
    return {
      ...invoice,
      isRecurring: !!invoice.isRecurring
    } as Invoice;
  }

  async createInvoice(invoice: Omit<Invoice, 'id'>): Promise<number> {
    const result = await this.db.prepare(
      `INSERT INTO invoices (
        company_id, 
        invoice_number, 
        invoice_type, 
        customer_id, 
        supplier_id, 
        issue_date, 
        due_date, 
        status, 
        subtotal, 
        tax_amount, 
        discount_amount, 
        total_amount, 
        notes, 
        terms, 
        is_recurring, 
        recurrence_pattern, 
        next_recurrence_date, 
        e_invoice_status, 
        e_invoice_reference
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
      RETURNING id`
    )
    .bind(
      invoice.companyId,
      invoice.invoiceNumber,
      invoice.invoiceType,
      invoice.customerId || null,
      invoice.supplierId || null,
      invoice.issueDate,
      invoice.dueDate,
      invoice.status,
      invoice.subtotal,
      invoice.taxAmount,
      invoice.discountAmount,
      invoice.totalAmount,
      invoice.notes || null,
      invoice.terms || null,
      invoice.isRecurring ? 1 : 0,
      invoice.recurrencePattern || null,
      invoice.nextRecurrenceDate || null,
      invoice.eInvoiceStatus || null,
      invoice.eInvoiceReference || null
    )
    .run();
    
    return result.results[0].id as number;
  }

  async updateInvoice(id: number, invoice: Partial<Invoice>): Promise<boolean> {
    const updates: string[] = [];
    const values: any[] = [];
    
    if (invoice.companyId !== undefined) {
      updates.push('company_id = ?');
      values.push(invoice.companyId);
    }
    
    if (invoice.invoiceNumber !== undefined) {
      updates.push('invoice_number = ?');
      values.push(invoice.invoiceNumber);
    }
    
    if (invoice.invoiceType !== undefined) {
      updates.push('invoice_type = ?');
      values.push(invoice.invoiceType);
    }
    
    if (invoice.customerId !== undefined) {
      updates.push('customer_id = ?');
      values.push(invoice.customerId || null);
    }
    
    if (invoice.supplierId !== undefined) {
      updates.push('supplier_id = ?');
      values.push(invoice.supplierId || null);
    }
    
    if (invoice.issueDate !== undefined) {
      updates.push('issue_date = ?');
      values.push(invoice.issueDate);
    }
    
    if (invoice.dueDate !== undefined) {
      updates.push('due_date = ?');
      values.push(invoice.dueDate);
    }
    
    if (invoice.status !== undefined) {
      updates.push('status = ?');
      values.push(invoice.status);
    }
    
    if (invoice.subtotal !== undefined) {
      updates.push('subtotal = ?');
      values.push(invoice.subtotal);
    }
    
    if (invoice.taxAmount !== undefined) {
      updates.push('tax_amount = ?');
      values.push(invoice.taxAmount);
    }
    
    if (invoice.discountAmount !== undefined) {
      updates.push('discount_amount = ?');
      values.push(invoice.discountAmount);
    }
    
    if (invoice.totalAmount !== undefined) {
      updates.push('total_amount = ?');
      values.push(invoice.totalAmount);
    }
    
    if (invoice.notes !== undefined) {
      updates.push('notes = ?');
      values.push(invoice.notes || null);
    }
    
    if (invoice.terms !== undefined) {
      updates.push('terms = ?');
      values.push(invoice.terms || null);
    }
    
    if (invoice.isRecurring !== undefined) {
      updates.push('is_recurring = ?');
      values.push(invoice.isRecurring ? 1 : 0);
    }
    
    if (invoice.recurrencePattern !== undefined) {
      updates.push('recurrence_pattern = ?');
      values.push(invoice.recurrencePattern || null);
    }
    
    if (invoice.nextRecurrenceDate !== undefined) {
      updates.push('next_recurrence_date = ?');
      values.push(invoice.nextRecurrenceDate || null);
    }
    
    if (invoice.eInvoiceStatus !== undefined) {
      updates.push('e_invoice_status = ?');
      values.push(invoice.eInvoiceStatus || null);
    }
    
    if (invoice.eInvoiceReference !== undefined) {
      updates.push('e_invoice_reference = ?');
      values.push(invoice.eInvoiceReference || null);
    }
    
    if (updates.length === 0) {
      return false;
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    
    const query = `UPDATE invoices SET ${updates.join(', ')} WHERE id = ?`;
    values.push(id);
    
    const result = await this.db.prepare(query).bind(...values).run();
    
    return result.success;
  }

  async deleteInvoice(id: number): Promise<boolean> {
    // First delete all invoice items
    await this.db.prepare('DELETE FROM invoice_items WHERE invoice_id = ?')
      .bind(id)
      .run();
    
    // Then delete the invoice
    const result = await this.db.prepare('DELETE FROM invoices WHERE id = ?')
      .bind(id)
      .run();
    
    return result.success;
  }

  async getInvoiceItems(invoiceId: number): Promise<InvoiceItem[]> {
    const { results } = await this.db.prepare(
      `SELECT 
        id, 
        invoice_id as invoiceId, 
        product_id as productId, 
        description, 
        quantity, 
        unit_price as unitPrice, 
        tax_rate as taxRate, 
        tax_amount as taxAmount, 
        discount_percentage as discountPercentage, 
        discount_amount as discountAmount, 
        total_amount as totalAmount 
      FROM invoice_items 
      WHERE invoice_id = ?`
    )
    .bind(invoiceId)
    .all();
    
    return results as InvoiceItem[];
  }

  async addInvoiceItem(item: Omit<InvoiceItem, 'id'>): Promise<number> {
    const result = await this.db.prepare(
      `INSERT INTO invoice_items (
        invoice_id, 
        product_id, 
        description, 
        quantity, 
        unit_price, 
        tax_rate, 
        tax_amount, 
        discount_percentage, 
        discount_amount, 
        total_amount
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
      RETURNING id`
    )
    .bind(
      item.invoiceId,
      item.productId,
      item.description || null,
      item.quantity,
      item.unitPrice,
      item.taxRate || null,
      item.taxAmount || null,
      item.discountPercentage || null,
      item.discountAmount || null,
      item.totalAmount
    )
    .run();
    
    return result.results[0].id as number;
  }

  async updateInvoiceItem(id: number, item: Partial<InvoiceItem>): Promise<boolean> {
    const updates: string[] = [];
    const values: any[] = [];
    
    if (item.invoiceId !== undefined) {
      updates.push('invoice_id = ?');
      values.push(item.invoiceId);
    }
    
    if (item.productId !== undefined) {
      updates.push('product_id = ?');
      values.push(item.productId);
    }
    
    if (item.description !== undefined) {
      updates.push('description = ?');
      values.push(item.description || null);
    }
    
    if (item.quantity !== undefined) {
      updates.push('quantity = ?');
      values.push(item.quantity);
    }
    
    if (item.unitPrice !== undefined) {
      updates.push('unit_price = ?');
      values.push(item.unitPrice);
    }
    
    if (item.taxRate !== undefined) {
      updates.push('tax_rate = ?');
      values.push(item.taxRate || null);
    }
    
    if (item.taxAmount !== undefined) {
      updates.push('tax_amount = ?');
      values.push(item.taxAmount || null);
    }
    
    if (item.discountPercentage !== undefined) {
      updates.push('discount_percentage = ?');
      values.push(item.discountPercentage || null);
    }
    
    if (item.discountAmount !== undefined) {
      updates.push('discount_amount = ?');
      values.push(item.discountAmount || null);
    }
    
    if (item.totalAmount !== undefined) {
      updates.push('total_amount = ?');
      values.push(item.totalAmount);
    }
    
    if (updates.length === 0) {
      return false;
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    
    const query = `UPDATE invoice_items SET ${updates.join(', ')} WHERE id = ?`;
    values.push(id);
    
    const result = await this.db.prepare(query).bind(...values).run();
    
    return result.success;
  }

  async deleteInvoiceItem(id: number): Promise<boolean> {
    const result = await this.db.prepare('DELETE FROM invoice_items WHERE id = ?')
      .bind(id)
      .run();
    
    return result.success;
  }

  async getInvoicesByStatus(companyId: number, status: Invoice['status']): Promise<Invoice[]> {
    const { results } = await this.db.prepare(
      `SELECT 
        id, 
        company_id as companyId, 
        invoice_number as invoiceNumber, 
        invoice_type as invoiceType, 
        customer_id as customerId, 
        supplier_id as supplierId, 
        issue_date as issueDate, 
        due_date as dueDate, 
        status, 
        subtotal, 
        tax_amount as taxAmount, 
        discount_amount as discountAmount, 
        total_amount as totalAmount, 
        notes, 
        terms, 
        is_recurring as isRecurring, 
        recurrence_pattern as recurrencePattern, 
        next_recurrence_date as nextRecurrenceDate, 
        e_invoice_status as eInvoiceStatus, 
        e_invoice_reference as eInvoiceReference 
      FROM invoices 
      WHERE company_id = ? AND status = ?
      ORDER BY issue_date DESC`
    )
    .bind(companyId, status)
    .all();
    
    return results.map(invoice => ({
      ...invoice,
      isRecurring: !!invoice.isRecurring
    })) as Invoice[];
  }

  async getOverdueInvoices(companyId: number): Promise<Invoice[]> {
    const { results } = await this.db.prepare(
      `SELECT 
        id, 
        company_id as companyId, 
        invoice_number as invoiceNumber, 
        invoice_type as invoiceType, 
        customer_id as customerId, 
        supplier_id as supplierId, 
        issue_date as issueDate, 
        due_date as dueDate, 
        status, 
        subtotal, 
        tax_amount as taxAmount, 
        discount_amount as discountAmount, 
        total_amount as totalAmount, 
        notes, 
        terms, 
        is_recurring as isRecurring, 
        recurrence_pattern as recurrencePattern, 
        next_recurrence_date as nextRecurrenceDate, 
        e_invoice_status as eInvoiceStatus, 
        e_invoice_reference as eInvoiceReference 
      FROM invoices 
      WHERE company_id = ? AND status = 'sent' AND due_date < date('now')
      ORDER BY due_date ASC`
    )
    .bind(companyId)
    .all();
    
    return results.map(invoice => ({
      ...invoice,
      isRecurring: !!invoice.isRecurring
    })) as Invoice[];
  }
}
