import { D1Database } from '@cloudflare/workers-types';

export interface ChartOfAccount {
  id: number;
  companyId: number;
  accountCode: string;
  accountName: string;
  accountType: string;
  accountCategory: string;
  isActive: boolean;
  description?: string;
}

export class AccountingService {
  constructor(private db: D1Database) {}

  async getChartOfAccounts(companyId: number): Promise<ChartOfAccount[]> {
    const { results } = await this.db.prepare(
      `SELECT 
        id, 
        company_id as companyId, 
        account_code as accountCode, 
        account_name as accountName, 
        account_type as accountType, 
        account_category as accountCategory, 
        is_active as isActive, 
        description 
      FROM chart_of_accounts 
      WHERE company_id = ?
      ORDER BY account_code`
    )
    .bind(companyId)
    .all();
    
    return results.map(account => ({
      ...account,
      isActive: !!account.isActive
    })) as ChartOfAccount[];
  }

  async getAccountById(id: number): Promise<ChartOfAccount | null> {
    const { results } = await this.db.prepare(
      `SELECT 
        id, 
        company_id as companyId, 
        account_code as accountCode, 
        account_name as accountName, 
        account_type as accountType, 
        account_category as accountCategory, 
        is_active as isActive, 
        description 
      FROM chart_of_accounts 
      WHERE id = ?`
    )
    .bind(id)
    .all();
    
    if (results.length === 0) {
      return null;
    }
    
    const account = results[0] as any;
    return {
      ...account,
      isActive: !!account.isActive
    } as ChartOfAccount;
  }

  async getAccountByCode(companyId: number, accountCode: string): Promise<ChartOfAccount | null> {
    const { results } = await this.db.prepare(
      `SELECT 
        id, 
        company_id as companyId, 
        account_code as accountCode, 
        account_name as accountName, 
        account_type as accountType, 
        account_category as accountCategory, 
        is_active as isActive, 
        description 
      FROM chart_of_accounts 
      WHERE company_id = ? AND account_code = ?`
    )
    .bind(companyId, accountCode)
    .all();
    
    if (results.length === 0) {
      return null;
    }
    
    const account = results[0] as any;
    return {
      ...account,
      isActive: !!account.isActive
    } as ChartOfAccount;
  }

  async createAccount(account: Omit<ChartOfAccount, 'id'>): Promise<number> {
    const result = await this.db.prepare(
      `INSERT INTO chart_of_accounts (
        company_id, 
        account_code, 
        account_name, 
        account_type, 
        account_category, 
        is_active, 
        description
      ) VALUES (?, ?, ?, ?, ?, ?, ?) 
      RETURNING id`
    )
    .bind(
      account.companyId,
      account.accountCode,
      account.accountName,
      account.accountType,
      account.accountCategory,
      account.isActive ? 1 : 0,
      account.description || null
    )
    .run();
    
    return result.results[0].id as number;
  }

  async updateAccount(id: number, account: Partial<ChartOfAccount>): Promise<boolean> {
    const updates: string[] = [];
    const values: any[] = [];
    
    if (account.companyId !== undefined) {
      updates.push('company_id = ?');
      values.push(account.companyId);
    }
    
    if (account.accountCode !== undefined) {
      updates.push('account_code = ?');
      values.push(account.accountCode);
    }
    
    if (account.accountName !== undefined) {
      updates.push('account_name = ?');
      values.push(account.accountName);
    }
    
    if (account.accountType !== undefined) {
      updates.push('account_type = ?');
      values.push(account.accountType);
    }
    
    if (account.accountCategory !== undefined) {
      updates.push('account_category = ?');
      values.push(account.accountCategory);
    }
    
    if (account.isActive !== undefined) {
      updates.push('is_active = ?');
      values.push(account.isActive ? 1 : 0);
    }
    
    if (account.description !== undefined) {
      updates.push('description = ?');
      values.push(account.description || null);
    }
    
    if (updates.length === 0) {
      return false;
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    
    const query = `UPDATE chart_of_accounts SET ${updates.join(', ')} WHERE id = ?`;
    values.push(id);
    
    const result = await this.db.prepare(query).bind(...values).run();
    
    return result.success;
  }

  async deleteAccount(id: number): Promise<boolean> {
    const result = await this.db.prepare('DELETE FROM chart_of_accounts WHERE id = ?')
      .bind(id)
      .run();
    
    return result.success;
  }

  async getAccountsByType(companyId: number, accountType: string): Promise<ChartOfAccount[]> {
    const { results } = await this.db.prepare(
      `SELECT 
        id, 
        company_id as companyId, 
        account_code as accountCode, 
        account_name as accountName, 
        account_type as accountType, 
        account_category as accountCategory, 
        is_active as isActive, 
        description 
      FROM chart_of_accounts 
      WHERE company_id = ? AND account_type = ?
      ORDER BY account_code`
    )
    .bind(companyId, accountType)
    .all();
    
    return results.map(account => ({
      ...account,
      isActive: !!account.isActive
    })) as ChartOfAccount[];
  }

  async getActiveAccounts(companyId: number): Promise<ChartOfAccount[]> {
    const { results } = await this.db.prepare(
      `SELECT 
        id, 
        company_id as companyId, 
        account_code as accountCode, 
        account_name as accountName, 
        account_type as accountType, 
        account_category as accountCategory, 
        is_active as isActive, 
        description 
      FROM chart_of_accounts 
      WHERE company_id = ? AND is_active = 1
      ORDER BY account_code`
    )
    .bind(companyId)
    .all();
    
    return results.map(account => ({
      ...account,
      isActive: true
    })) as ChartOfAccount[];
  }

  // Journal Entry related methods
  async createJournalEntry(
    companyId: number, 
    entryNumber: string, 
    entryDate: string, 
    description: string, 
    reference: string, 
    createdBy: number,
    lines: Array<{
      accountId: number;
      description?: string;
      debitAmount: number;
      creditAmount: number;
    }>
  ): Promise<number> {
    // Start a transaction
    await this.db.exec('BEGIN TRANSACTION');
    
    try {
      // Create journal entry
      const journalEntryResult = await this.db.prepare(
        `INSERT INTO journal_entries (
          company_id, 
          entry_number, 
          entry_date, 
          description, 
          reference, 
          is_posted, 
          created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?) 
        RETURNING id`
      )
      .bind(
        companyId,
        entryNumber,
        entryDate,
        description,
        reference,
        0, // Not posted initially
        createdBy
      )
      .run();
      
      const journalEntryId = journalEntryResult.results[0].id as number;
      
      // Create journal entry lines
      for (const line of lines) {
        await this.db.prepare(
          `INSERT INTO journal_entry_lines (
            journal_entry_id, 
            account_id, 
            description, 
            debit_amount, 
            credit_amount
          ) VALUES (?, ?, ?, ?, ?)`
        )
        .bind(
          journalEntryId,
          line.accountId,
          line.description || null,
          line.debitAmount,
          line.creditAmount
        )
        .run();
      }
      
      // Commit the transaction
      await this.db.exec('COMMIT');
      
      return journalEntryId;
    } catch (error) {
      // Rollback the transaction in case of error
      await this.db.exec('ROLLBACK');
      throw error;
    }
  }

  async postJournalEntry(id: number): Promise<boolean> {
    const result = await this.db.prepare(
      'UPDATE journal_entries SET is_posted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    )
    .bind(id)
    .run();
    
    return result.success;
  }

  async getJournalEntries(companyId: number): Promise<any[]> {
    const { results } = await this.db.prepare(
      `SELECT 
        je.id, 
        je.company_id as companyId, 
        je.entry_number as entryNumber, 
        je.entry_date as entryDate, 
        je.description, 
        je.reference, 
        je.is_posted as isPosted, 
        je.created_by as createdBy,
        u.first_name || ' ' || u.last_name as createdByName,
        SUM(jel.debit_amount) as totalDebit,
        SUM(jel.credit_amount) as totalCredit
      FROM journal_entries je
      JOIN users u ON je.created_by = u.id
      JOIN journal_entry_lines jel ON je.id = jel.journal_entry_id
      WHERE je.company_id = ?
      GROUP BY je.id
      ORDER BY je.entry_date DESC, je.id DESC`
    )
    .bind(companyId)
    .all();
    
    return results.map(entry => ({
      ...entry,
      isPosted: !!entry.isPosted
    }));
  }

  async getJournalEntryWithLines(id: number): Promise<any> {
    // Get journal entry
    const { results: entryResults } = await this.db.prepare(
      `SELECT 
        je.id, 
        je.company_id as companyId, 
        je.entry_number as entryNumber, 
        je.entry_date as entryDate, 
        je.description, 
        je.reference, 
        je.is_posted as isPosted, 
        je.created_by as createdBy,
        u.first_name || ' ' || u.last_name as createdByName
      FROM journal_entries je
      JOIN users u ON je.created_by = u.id
      WHERE je.id = ?`
    )
    .bind(id)
    .all();
    
    if (entryResults.length === 0) {
      return null;
    }
    
    const entry = {
      ...entryResults[0],
      isPosted: !!entryResults[0].isPosted
    };
    
    // Get journal entry lines
    const { results: lineResults } = await this.db.prepare(
      `SELECT 
        jel.id, 
        jel.journal_entry_id as journalEntryId, 
        jel.account_id as accountId, 
        coa.account_code as accountCode,
        coa.account_name as accountName,
        jel.description, 
        jel.debit_amount as debitAmount, 
        jel.credit_amount as creditAmount
      FROM journal_entry_lines jel
      JOIN chart_of_accounts coa ON jel.account_id = coa.id
      WHERE jel.journal_entry_id = ?
      ORDER BY jel.id`
    )
    .bind(id)
    .all();
    
    return {
      ...entry,
      lines: lineResults
    };
  }
}
