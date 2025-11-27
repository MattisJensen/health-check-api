import type { HealthCheckRepository } from '../application/healthCheckRepository.js';
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
      return true;
    } catch {
      return false;
    }
  }

  async hasRequiredData(): Promise<boolean> {
    try {
        return true;
    } catch {
      return false;
    }
  }
}