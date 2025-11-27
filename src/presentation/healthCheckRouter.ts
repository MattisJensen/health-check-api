import type { Request, Response } from "express";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { CheckDatabaseConnectionUseCase } from "../application/checkDatabaseConnectionUseCase.js";
import { CheckDataAvailabilityUseCase } from "../application/checkDataAvailabilityUseCase.js";
import { HealthStatusDTO } from "./dto/healthStatusDTO.js";

export function createHealthCheckRouter(
  dbConnectionUseCase: CheckDatabaseConnectionUseCase,
  dataAvailabilityUseCase: CheckDataAvailabilityUseCase
) {
  const router = Router();

  const limiter = rateLimit({
    windowMs: 10 * 1000, // 10 seconds
    limit: 1, // each IP can make up to 1 requests per `windowsMs`
    standardHeaders: true,
    legacyHeaders: false,
  });

  router.get("/", limiter, async (req: Request, res: Response) => {
    const rawQuery = req.query.query;

    // Verify Query
    const query = typeof rawQuery === "string" ? rawQuery : undefined;
    const validQueryParams = ["database", "data"];
    if (query && !validQueryParams.includes(query)) {
      return res.sendStatus(400);
    }

    // Return Health Check
    const status = new HealthStatusDTO();

    if (query === "database") {
      try {
        status.db_connected = await dbConnectionUseCase.execute();
      } catch {
        status.db_connected = false;
      }
      return res.status(200).json(status);
    }

    if (query === "data") {
      try {
        status.has_data = await dataAvailabilityUseCase.execute();
      } catch {
        status.has_data = false;
      }
      return res.status(200).json(status);
    }

    try {
      status.db_connected = await dbConnectionUseCase.execute();
    } catch {
      status.db_connected = false;
    }

    try {
      status.has_data = await dataAvailabilityUseCase.execute();
    } catch {
      status.has_data = false;
    }

    res.status(200).json(status);
  });

  return router;
}
