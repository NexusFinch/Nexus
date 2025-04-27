import { D1Database } from '@cloudflare/workers-types';

export interface Company {
  id: number;
  name: string;
  tradeLicenseNumber?: string;
  taxRegistrationNumber?: string;
  address?: string;
  city?: string;
  country: string;
  phone?: string;
  email?: string;
  website?: string;
  fiscalYearStart?: string;
  baseCurrency: string;
  logoUrl?: string;
}

export class CompanyService {
  constructor(private db: D1Database) {}

  async getCompanies(): Promise<Company[]> {
    const { results } = await this.db.prepare(
      `SELECT 
        id, 
        name, 
        trade_license_number as tradeLicenseNumber, 
        tax_registration_number as taxRegistrationNumber, 
        address, 
        city, 
        country, 
        phone, 
        email, 
        website, 
        fiscal_year_start as fiscalYearStart, 
        base_currency as baseCurrency, 
        logo_url as logoUrl 
      FROM companies`
    ).all();
    
    return results as Company[];
  }

  async getCompanyById(id: number): Promise<Company | null> {
    const { results } = await this.db.prepare(
      `SELECT 
        id, 
        name, 
        trade_license_number as tradeLicenseNumber, 
        tax_registration_number as taxRegistrationNumber, 
        address, 
        city, 
        country, 
        phone, 
        email, 
        website, 
        fiscal_year_start as fiscalYearStart, 
        base_currency as baseCurrency, 
        logo_url as logoUrl 
      FROM companies 
      WHERE id = ?`
    )
    .bind(id)
    .all();
    
    if (results.length === 0) {
      return null;
    }
    
    return results[0] as Company;
  }

  async createCompany(company: Omit<Company, 'id'>): Promise<number> {
    const result = await this.db.prepare(
      `INSERT INTO companies (
        name, 
        trade_license_number, 
        tax_registration_number, 
        address, 
        city, 
        country, 
        phone, 
        email, 
        website, 
        fiscal_year_start, 
        base_currency, 
        logo_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
      RETURNING id`
    )
    .bind(
      company.name,
      company.tradeLicenseNumber || null,
      company.taxRegistrationNumber || null,
      company.address || null,
      company.city || null,
      company.country,
      company.phone || null,
      company.email || null,
      company.website || null,
      company.fiscalYearStart || null,
      company.baseCurrency,
      company.logoUrl || null
    )
    .run();
    
    return result.results[0].id as number;
  }

  async updateCompany(id: number, company: Partial<Company>): Promise<boolean> {
    const updates: string[] = [];
    const values: any[] = [];
    
    if (company.name !== undefined) {
      updates.push('name = ?');
      values.push(company.name);
    }
    
    if (company.tradeLicenseNumber !== undefined) {
      updates.push('trade_license_number = ?');
      values.push(company.tradeLicenseNumber || null);
    }
    
    if (company.taxRegistrationNumber !== undefined) {
      updates.push('tax_registration_number = ?');
      values.push(company.taxRegistrationNumber || null);
    }
    
    if (company.address !== undefined) {
      updates.push('address = ?');
      values.push(company.address || null);
    }
    
    if (company.city !== undefined) {
      updates.push('city = ?');
      values.push(company.city || null);
    }
    
    if (company.country !== undefined) {
      updates.push('country = ?');
      values.push(company.country);
    }
    
    if (company.phone !== undefined) {
      updates.push('phone = ?');
      values.push(company.phone || null);
    }
    
    if (company.email !== undefined) {
      updates.push('email = ?');
      values.push(company.email || null);
    }
    
    if (company.website !== undefined) {
      updates.push('website = ?');
      values.push(company.website || null);
    }
    
    if (company.fiscalYearStart !== undefined) {
      updates.push('fiscal_year_start = ?');
      values.push(company.fiscalYearStart || null);
    }
    
    if (company.baseCurrency !== undefined) {
      updates.push('base_currency = ?');
      values.push(company.baseCurrency);
    }
    
    if (company.logoUrl !== undefined) {
      updates.push('logo_url = ?');
      values.push(company.logoUrl || null);
    }
    
    if (updates.length === 0) {
      return false;
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    
    const query = `UPDATE companies SET ${updates.join(', ')} WHERE id = ?`;
    values.push(id);
    
    const result = await this.db.prepare(query).bind(...values).run();
    
    return result.success;
  }

  async deleteCompany(id: number): Promise<boolean> {
    const result = await this.db.prepare('DELETE FROM companies WHERE id = ?')
      .bind(id)
      .run();
    
    return result.success;
  }
}
