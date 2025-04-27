import { D1Database } from '@cloudflare/workers-types';

export interface Product {
  id: number;
  companyId: number;
  code: string;
  name: string;
  description?: string;
  category?: string;
  type: string; // 'inventory' or 'service'
  purchasePrice?: number;
  salePrice: number;
  taxRate?: number;
  isActive: boolean;
}

export class ProductService {
  constructor(private db: D1Database) {}

  async getProducts(companyId: number): Promise<Product[]> {
    const { results } = await this.db.prepare(
      `SELECT 
        id, 
        company_id as companyId, 
        code, 
        name, 
        description, 
        category, 
        type, 
        purchase_price as purchasePrice, 
        sale_price as salePrice, 
        tax_rate as taxRate, 
        is_active as isActive 
      FROM products 
      WHERE company_id = ?`
    )
    .bind(companyId)
    .all();
    
    return results.map(product => ({
      ...product,
      isActive: !!product.isActive
    })) as Product[];
  }

  async getProductById(id: number): Promise<Product | null> {
    const { results } = await this.db.prepare(
      `SELECT 
        id, 
        company_id as companyId, 
        code, 
        name, 
        description, 
        category, 
        type, 
        purchase_price as purchasePrice, 
        sale_price as salePrice, 
        tax_rate as taxRate, 
        is_active as isActive 
      FROM products 
      WHERE id = ?`
    )
    .bind(id)
    .all();
    
    if (results.length === 0) {
      return null;
    }
    
    const product = results[0] as any;
    return {
      ...product,
      isActive: !!product.isActive
    } as Product;
  }

  async getProductByCode(companyId: number, code: string): Promise<Product | null> {
    const { results } = await this.db.prepare(
      `SELECT 
        id, 
        company_id as companyId, 
        code, 
        name, 
        description, 
        category, 
        type, 
        purchase_price as purchasePrice, 
        sale_price as salePrice, 
        tax_rate as taxRate, 
        is_active as isActive 
      FROM products 
      WHERE company_id = ? AND code = ?`
    )
    .bind(companyId, code)
    .all();
    
    if (results.length === 0) {
      return null;
    }
    
    const product = results[0] as any;
    return {
      ...product,
      isActive: !!product.isActive
    } as Product;
  }

  async createProduct(product: Omit<Product, 'id'>): Promise<number> {
    const result = await this.db.prepare(
      `INSERT INTO products (
        company_id, 
        code, 
        name, 
        description, 
        category, 
        type, 
        purchase_price, 
        sale_price, 
        tax_rate, 
        is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
      RETURNING id`
    )
    .bind(
      product.companyId,
      product.code,
      product.name,
      product.description || null,
      product.category || null,
      product.type,
      product.purchasePrice || null,
      product.salePrice,
      product.taxRate || null,
      product.isActive ? 1 : 0
    )
    .run();
    
    return result.results[0].id as number;
  }

  async updateProduct(id: number, product: Partial<Product>): Promise<boolean> {
    const updates: string[] = [];
    const values: any[] = [];
    
    if (product.companyId !== undefined) {
      updates.push('company_id = ?');
      values.push(product.companyId);
    }
    
    if (product.code !== undefined) {
      updates.push('code = ?');
      values.push(product.code);
    }
    
    if (product.name !== undefined) {
      updates.push('name = ?');
      values.push(product.name);
    }
    
    if (product.description !== undefined) {
      updates.push('description = ?');
      values.push(product.description || null);
    }
    
    if (product.category !== undefined) {
      updates.push('category = ?');
      values.push(product.category || null);
    }
    
    if (product.type !== undefined) {
      updates.push('type = ?');
      values.push(product.type);
    }
    
    if (product.purchasePrice !== undefined) {
      updates.push('purchase_price = ?');
      values.push(product.purchasePrice || null);
    }
    
    if (product.salePrice !== undefined) {
      updates.push('sale_price = ?');
      values.push(product.salePrice);
    }
    
    if (product.taxRate !== undefined) {
      updates.push('tax_rate = ?');
      values.push(product.taxRate || null);
    }
    
    if (product.isActive !== undefined) {
      updates.push('is_active = ?');
      values.push(product.isActive ? 1 : 0);
    }
    
    if (updates.length === 0) {
      return false;
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    
    const query = `UPDATE products SET ${updates.join(', ')} WHERE id = ?`;
    values.push(id);
    
    const result = await this.db.prepare(query).bind(...values).run();
    
    return result.success;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await this.db.prepare('DELETE FROM products WHERE id = ?')
      .bind(id)
      .run();
    
    return result.success;
  }

  async getProductsByCategory(companyId: number, category: string): Promise<Product[]> {
    const { results } = await this.db.prepare(
      `SELECT 
        id, 
        company_id as companyId, 
        code, 
        name, 
        description, 
        category, 
        type, 
        purchase_price as purchasePrice, 
        sale_price as salePrice, 
        tax_rate as taxRate, 
        is_active as isActive 
      FROM products 
      WHERE company_id = ? AND category = ?`
    )
    .bind(companyId, category)
    .all();
    
    return results.map(product => ({
      ...product,
      isActive: !!product.isActive
    })) as Product[];
  }

  async getActiveProducts(companyId: number): Promise<Product[]> {
    const { results } = await this.db.prepare(
      `SELECT 
        id, 
        company_id as companyId, 
        code, 
        name, 
        description, 
        category, 
        type, 
        purchase_price as purchasePrice, 
        sale_price as salePrice, 
        tax_rate as taxRate, 
        is_active as isActive 
      FROM products 
      WHERE company_id = ? AND is_active = 1`
    )
    .bind(companyId)
    .all();
    
    return results.map(product => ({
      ...product,
      isActive: true
    })) as Product[];
  }
}
