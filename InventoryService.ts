import { D1Database } from '@cloudflare/workers-types';

export interface Inventory {
  id: number;
  productId: number;
  warehouseId: number;
  quantityOnHand: number;
  reorderLevel?: number;
  reorderQuantity?: number;
  lastStockTakeDate?: string;
}

export interface Warehouse {
  id: number;
  companyId: number;
  name: string;
  location?: string;
  isActive: boolean;
}

export class InventoryService {
  constructor(private db: D1Database) {}

  // Warehouse methods
  async getWarehouses(companyId: number): Promise<Warehouse[]> {
    const { results } = await this.db.prepare(
      `SELECT 
        id, 
        company_id as companyId, 
        name, 
        location, 
        is_active as isActive 
      FROM warehouses 
      WHERE company_id = ?`
    )
    .bind(companyId)
    .all();
    
    return results.map(warehouse => ({
      ...warehouse,
      isActive: !!warehouse.isActive
    })) as Warehouse[];
  }

  async getWarehouseById(id: number): Promise<Warehouse | null> {
    const { results } = await this.db.prepare(
      `SELECT 
        id, 
        company_id as companyId, 
        name, 
        location, 
        is_active as isActive 
      FROM warehouses 
      WHERE id = ?`
    )
    .bind(id)
    .all();
    
    if (results.length === 0) {
      return null;
    }
    
    const warehouse = results[0] as any;
    return {
      ...warehouse,
      isActive: !!warehouse.isActive
    } as Warehouse;
  }

  async createWarehouse(warehouse: Omit<Warehouse, 'id'>): Promise<number> {
    const result = await this.db.prepare(
      `INSERT INTO warehouses (
        company_id, 
        name, 
        location, 
        is_active
      ) VALUES (?, ?, ?, ?) 
      RETURNING id`
    )
    .bind(
      warehouse.companyId,
      warehouse.name,
      warehouse.location || null,
      warehouse.isActive ? 1 : 0
    )
    .run();
    
    return result.results[0].id as number;
  }

  async updateWarehouse(id: number, warehouse: Partial<Warehouse>): Promise<boolean> {
    const updates: string[] = [];
    const values: any[] = [];
    
    if (warehouse.companyId !== undefined) {
      updates.push('company_id = ?');
      values.push(warehouse.companyId);
    }
    
    if (warehouse.name !== undefined) {
      updates.push('name = ?');
      values.push(warehouse.name);
    }
    
    if (warehouse.location !== undefined) {
      updates.push('location = ?');
      values.push(warehouse.location || null);
    }
    
    if (warehouse.isActive !== undefined) {
      updates.push('is_active = ?');
      values.push(warehouse.isActive ? 1 : 0);
    }
    
    if (updates.length === 0) {
      return false;
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    
    const query = `UPDATE warehouses SET ${updates.join(', ')} WHERE id = ?`;
    values.push(id);
    
    const result = await this.db.prepare(query).bind(...values).run();
    
    return result.success;
  }

  async deleteWarehouse(id: number): Promise<boolean> {
    // Check if warehouse has inventory
    const { results } = await this.db.prepare(
      'SELECT COUNT(*) as count FROM inventory WHERE warehouse_id = ?'
    )
    .bind(id)
    .all();
    
    if (results[0].count > 0) {
      // Cannot delete warehouse with inventory
      return false;
    }
    
    const result = await this.db.prepare('DELETE FROM warehouses WHERE id = ?')
      .bind(id)
      .run();
    
    return result.success;
  }

  // Inventory methods
  async getInventory(productId?: number, warehouseId?: number): Promise<Inventory[]> {
    let query = `
      SELECT 
        id, 
        product_id as productId, 
        warehouse_id as warehouseId, 
        quantity_on_hand as quantityOnHand, 
        reorder_level as reorderLevel, 
        reorder_quantity as reorderQuantity, 
        last_stock_take_date as lastStockTakeDate 
      FROM inventory 
      WHERE 1=1
    `;
    
    const params: any[] = [];
    
    if (productId !== undefined) {
      query += ' AND product_id = ?';
      params.push(productId);
    }
    
    if (warehouseId !== undefined) {
      query += ' AND warehouse_id = ?';
      params.push(warehouseId);
    }
    
    const { results } = await this.db.prepare(query)
      .bind(...params)
      .all();
    
    return results as Inventory[];
  }

  async getInventoryById(id: number): Promise<Inventory | null> {
    const { results } = await this.db.prepare(
      `SELECT 
        id, 
        product_id as productId, 
        warehouse_id as warehouseId, 
        quantity_on_hand as quantityOnHand, 
        reorder_level as reorderLevel, 
        reorder_quantity as reorderQuantity, 
        last_stock_take_date as lastStockTakeDate 
      FROM inventory 
      WHERE id = ?`
    )
    .bind(id)
    .all();
    
    if (results.length === 0) {
      return null;
    }
    
    return results[0] as Inventory;
  }

  async getProductInventory(productId: number): Promise<any[]> {
    const { results } = await this.db.prepare(
      `SELECT 
        i.id, 
        i.product_id as productId, 
        i.warehouse_id as warehouseId, 
        w.name as warehouseName,
        i.quantity_on_hand as quantityOnHand, 
        i.reorder_level as reorderLevel, 
        i.reorder_quantity as reorderQuantity, 
        i.last_stock_take_date as lastStockTakeDate 
      FROM inventory i
      JOIN warehouses w ON i.warehouse_id = w.id
      WHERE i.product_id = ?`
    )
    .bind(productId)
    .all();
    
    return results;
  }

  async createInventory(inventory: Omit<Inventory, 'id'>): Promise<number> {
    // Check if inventory already exists for this product and warehouse
    const { results } = await this.db.prepare(
      'SELECT id FROM inventory WHERE product_id = ? AND warehouse_id = ?'
    )
    .bind(inventory.productId, inventory.warehouseId)
    .all();
    
    if (results.length > 0) {
      // Update existing inventory instead of creating a new one
      await this.updateInventory(results[0].id, inventory);
      return results[0].id;
    }
    
    const result = await this.db.prepare(
      `INSERT INTO inventory (
        product_id, 
        warehouse_id, 
        quantity_on_hand, 
        reorder_level, 
        reorder_quantity, 
        last_stock_take_date
      ) VALUES (?, ?, ?, ?, ?, ?) 
      RETURNING id`
    )
    .bind(
      inventory.productId,
      inventory.warehouseId,
      inventory.quantityOnHand,
      inventory.reorderLevel || null,
      inventory.reorderQuantity || null,
      inventory.lastStockTakeDate || null
    )
    .run();
    
    return result.results[0].id as number;
  }

  async updateInventory(id: number, inventory: Partial<Inventory>): Promise<boolean> {
    const updates: string[] = [];
    const values: any[] = [];
    
    if (inventory.productId !== undefined) {
      updates.push('product_id = ?');
      values.push(inventory.productId);
    }
    
    if (inventory.warehouseId !== undefined) {
      updates.push('warehouse_id = ?');
      values.push(inventory.warehouseId);
    }
    
    if (inventory.quantityOnHand !== undefined) {
      updates.push('quantity_on_hand = ?');
      values.push(inventory.quantityOnHand);
    }
    
    if (inventory.reorderLevel !== undefined) {
      updates.push('reorder_level = ?');
      values.push(inventory.reorderLevel || null);
    }
    
    if (inventory.reorderQuantity !== undefined) {
      updates.push('reorder_quantity = ?');
      values.push(inventory.reorderQuantity || null);
    }
    
    if (inventory.lastStockTakeDate !== undefined) {
      updates.push('last_stock_take_date = ?');
      values.push(inventory.lastStockTakeDate || null);
    }
    
    if (updates.length === 0) {
      return false;
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    
    const query = `UPDATE inventory SET ${updates.join(', ')} WHERE id = ?`;
    values.push(id);
    
    const result = await this.db.prepare(query).bind(...values).run();
    
    return result.success;
  }

  async adjustInventory(productId: number, warehouseId: number, quantity: number): Promise<boolean> {
    // Get current inventory
    const { results } = await this.db.prepare(
      'SELECT id, quantity_on_hand FROM inventory WHERE product_id = ? AND warehouse_id = ?'
    )
    .bind(productId, warehouseId)
    .all();
    
    if (results.length === 0) {
      // Create new inventory if it doesn't exist
      if (quantity <= 0) {
        return false; // Cannot adjust to negative quantity for new inventory
      }
      
      await this.createInventory({
        productId,
        warehouseId,
        quantityOnHand: quantity
      });
      
      return true;
    }
    
    const inventoryId = results[0].id;
    const currentQuantity = results[0].quantity_on_hand;
    const newQuantity = currentQuantity + quantity;
    
    if (newQuantity < 0) {
      return false; // Cannot adjust to negative quantity
    }
    
    const result = await this.db.prepare(
      'UPDATE inventory SET quantity_on_hand = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    )
    .bind(newQuantity, inventoryId)
    .run();
    
    return result.success;
  }

  async getLowStockItems(companyId: number): Promise<any[]> {
    const { results } = await this.db.prepare(
      `SELECT 
        i.id, 
        p.id as productId,
        p.code as productCode,
        p.name as productName,
        i.warehouse_id as warehouseId, 
        w.name as warehouseName,
        i.quantity_on_hand as quantityOnHand, 
        i.reorder_level as reorderLevel
      FROM inventory i
      JOIN products p ON i.product_id = p.id
      JOIN warehouses w ON i.warehouse_id = w.id
      WHERE p.company_id = ? 
        AND i.reorder_level IS NOT NULL 
        AND i.quantity_on_hand <= i.reorder_level
      ORDER BY (i.quantity_on_hand * 1.0 / i.reorder_level) ASC`
    )
    .bind(companyId)
    .all();
    
    return results;
  }

  async getInventorySummary(companyId: number): Promise<any> {
    // Get total inventory value
    const { results: valueResults } = await this.db.prepare(
      `SELECT 
        SUM(p.purchase_price * i.quantity_on_hand) as totalValue,
        COUNT(DISTINCT p.id) as totalProducts,
        SUM(i.quantity_on_hand) as totalQuantity
      FROM inventory i
      JOIN products p ON i.product_id = p.id
      WHERE p.company_id = ? AND p.type = 'inventory'`
    )
    .bind(companyId)
    .all();
    
    // Get low stock count
    const { results: lowStockResults } = await this.db.prepare(
      `SELECT 
        COUNT(*) as lowStockCount
      FROM inventory i
      JOIN products p ON i.product_id = p.id
      WHERE p.company_id = ? 
        AND i.reorder_level IS NOT NULL 
        AND i.quantity_on_hand <= i.reorder_level`
    )
    .bind(companyId)
    .all();
    
    return {
      totalValue: valueResults[0].totalValue || 0,
      totalProducts: valueResults[0].totalProducts || 0,
      totalQuantity: valueResults[0].totalQuantity || 0,
      lowStockCount: lowStockResults[0].lowStockCount || 0
    };
  }
}
