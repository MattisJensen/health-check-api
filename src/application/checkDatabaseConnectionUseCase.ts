import type { HealthCheckRepository } from "./healthCheckRepository.js";
import { DatabaseConnectionError } from "../core/databaseConnectionError.js";

export class CheckDatabaseConnectionUseCase {
  private repository: HealthCheckRepository;

  constructor(repository: HealthCheckRepository) {
    this.repository = repository;
  }

  async execute(): Promise<boolean> {
    try {
      return await this.repository.isDatabaseConnected();
    } catch {
      throw new DatabaseConnectionError("Failed to connect to the database");
    }
  }
}
