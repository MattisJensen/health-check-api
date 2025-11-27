import { HealthCheckRepositoryImpl } from './infrastructure/healthCheckRepositoryImpl.js';
import { CheckDatabaseConnectionUseCase } from './application/checkDatabaseConnectionUseCase.js';
import { CheckDataAvailabilityUseCase } from './application/checkDataAvailabilityUseCase.js';

export class DependencyProvider {
  healthCheckRepository = new HealthCheckRepositoryImpl();
  checkDatabaseConnectionUseCase = new CheckDatabaseConnectionUseCase(this.healthCheckRepository);
  checkDataAvailabilityUseCase = new CheckDataAvailabilityUseCase(this.healthCheckRepository);
}