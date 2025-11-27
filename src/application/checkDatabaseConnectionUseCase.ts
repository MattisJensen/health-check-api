import type { HealthCheckRepository } from "./healthCheckRepository.js";

export class CheckDatabaseConnectionUseCase {
  private repository: HealthCheckRepository;

  constructor(repository: HealthCheckRepository) {
    this.repository = repository;
  }

  async execute(): Promise<boolean> {
    try {
      return await this.repository.isDatabaseConnected();
    } catch {
      return false;
    }
  }
}
