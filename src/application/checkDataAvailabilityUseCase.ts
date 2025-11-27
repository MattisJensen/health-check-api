import type { HealthCheckRepository } from "./healthCheckRepository.js";
import { DatabaseConnectionError } from "../core/databaseConnectionError.js";

export class CheckDataAvailabilityUseCase {
  private repository: HealthCheckRepository;

  constructor(repository: HealthCheckRepository) {
    this.repository = repository;
  }

  async execute(): Promise<boolean> {
    try {
      return await this.repository.hasRequiredData();
    } catch {
      return false;
    }
  }
}
