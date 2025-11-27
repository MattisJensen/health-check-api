import type { HealthCheckRepository } from '../application/healthCheckRepository.js';
import { DatabaseConnectionError } from '../core/databaseConnectionError.js';
import { Pool } from 'pg';

export class HealthCheckRepositoryImpl implements HealthCheckRepository {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
  }

  async isDatabaseConnected(): Promise<boolean> {
    try {
      await this.pool.query('SELECT 1');
      return true;
    } catch {
      throw new DatabaseConnectionError('Unable to connect to the database');
    }
  }

  async hasRequiredData(): Promise<boolean> {
    const tableName = process.env.TABLE_TASK;
    if (!tableName) return false;
    try {
      const result = await this.pool.query(`SELECT 1 FROM ${tableName} LIMIT 1`);
      return result.rows.length > 0;
    } catch {
      throw new DatabaseConnectionError('Unable to check required data');
    }
  }
}