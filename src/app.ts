import express from 'express';
import { createHealthCheckRouter } from './presentation/healthCheckRouter.js';
import type { CheckDatabaseConnectionUseCase } from './application/checkDatabaseConnectionUseCase.js';
import type { CheckDataAvailabilityUseCase } from './application/checkDataAvailabilityUseCase.js';

export function createExpressApp(
  dbUseCase: CheckDatabaseConnectionUseCase,
  dataUseCase: CheckDataAvailabilityUseCase
) {
  const app = express();
  const healthCheckRouter = createHealthCheckRouter(dbUseCase, dataUseCase);
  app.use('/api/health', healthCheckRouter);
  return app;
}