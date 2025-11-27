export interface HealthCheckRepository {
  isDatabaseConnected(): Promise<boolean>;
  hasRequiredData(): Promise<boolean>;
}