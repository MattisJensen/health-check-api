import type { Request, Response } from "express";
import { Router } from "express";
import { CheckDatabaseConnectionUseCase } from "../application/checkDatabaseConnectionUseCase.js";
import { CheckDataAvailabilityUseCase } from "../application/checkDataAvailabilityUseCase.js";
import { HealthStatusDTO } from "./dto/healthStatusDTO.js";

export function createHealthCheckRouter(
  dbUseCase: CheckDatabaseConnectionUseCase,
  dataUseCase: CheckDataAvailabilityUseCase
) {
  const router = Router();

  router.get("/", async (req: Request, res: Response) => {
    const status = new HealthStatusDTO();

    try {
      status.db_connected = await dbUseCase.execute();
    } catch {
      status.db_connected = false;
    }

    try {
      status.has_data = await dataUseCase.execute();
    } catch {
      status.has_data = false;
    }

    res.status(200).json(status);
  });

  return router;
}
