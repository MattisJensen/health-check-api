import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import request from "supertest";
import express from "express";
import { createHealthCheckRouter } from "../../src/presentation/healthCheckRouter";

describe("createHealthCheckRouter", () => {
  let dbConnectionUseCase: { execute: jest.Mock };
  let dataAvailabilityUseCase: { execute: jest.Mock };
  let app: express.Express;

  beforeEach(() => {
    dbConnectionUseCase = { execute: jest.fn() };
    dataAvailabilityUseCase = { execute: jest.fn() };
    app = express();
    app.use(
      "/",
      createHealthCheckRouter(
        dbConnectionUseCase as any,
        dataAvailabilityUseCase as any
      )
    );
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("without query parameters", () => {
    it("should return both db_connected and has_data when no query is provided", async () => {
      // Arrange
      dbConnectionUseCase.execute.mockImplementation(() =>
        Promise.resolve(true)
      );
      dataAvailabilityUseCase.execute.mockImplementation(() =>
        Promise.resolve(true)
      );

      // Act
      const res = await request(app).get("/");

      // Assert
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ db_connected: true, has_data: true });
      expect(dbConnectionUseCase.execute).toHaveBeenCalledTimes(1);
      expect(dataAvailabilityUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it("should return db_connected as false if dbConnectionUseCase throws", async () => {
      // Arrange
      dbConnectionUseCase.execute.mockImplementation(() =>
        Promise.reject(new Error("Some error"))
      );
      dataAvailabilityUseCase.execute.mockImplementation(() =>
        Promise.resolve(true)
      );

      // Act
      const res = await request(app).get("/");

      // Assert
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ db_connected: false, has_data: true });
    });

    it("should return has_data as false if dataAvailabilityUseCase throws", async () => {
      // Arrange
      dbConnectionUseCase.execute.mockImplementation(() =>
        Promise.resolve(true)
      );
      dataAvailabilityUseCase.execute.mockImplementation(() =>
        Promise.reject(new Error("Some error"))
      );

      // Act
      const res = await request(app).get("/");

      // Assert
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ db_connected: true, has_data: false });
    });
  });

  describe("with query parameters", () => {
    it("should return 400 for invalid query parameter", async () => {
      // Act
      const res = await request(app).get("/?query=invalid");

      // Assert
      expect(res.status).toBe(400);
      expect(res.body).toEqual({});
      expect(dbConnectionUseCase.execute).not.toHaveBeenCalled();
      expect(dataAvailabilityUseCase.execute).not.toHaveBeenCalled();
    });

    describe("query=database", () => {
      it("should return only db_connected when query=database", async () => {
        // Arrange
        dbConnectionUseCase.execute.mockImplementation(() =>
          Promise.resolve(true)
        );

        // Act
        const res = await request(app).get("/?query=database");

        // Assert
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ db_connected: true });
        expect(dbConnectionUseCase.execute).toHaveBeenCalledTimes(1);
        expect(dataAvailabilityUseCase.execute).not.toHaveBeenCalled();
      });

      it("should return db_connected as false if dbConnectionUseCase throws for query=database", async () => {
        // Arrange
        dbConnectionUseCase.execute.mockImplementation(() =>
          Promise.reject(new Error("Some error"))
        );

        // Act
        const res = await request(app).get("/?query=database");

        // Assert
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ db_connected: false });
      });
    });

    describe("query=data", () => {
      it("should return only has_data when query=data", async () => {
        // Arrange
        dataAvailabilityUseCase.execute.mockImplementation(() =>
          Promise.resolve(true)
        );

        // Act
        const res = await request(app).get("/?query=data");

        // Assert
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ has_data: true });
        expect(dataAvailabilityUseCase.execute).toHaveBeenCalledTimes(1);
        expect(dbConnectionUseCase.execute).not.toHaveBeenCalled();
      });

      it("should return has_data as false if dataAvailabilityUseCase throws for query=data", async () => {
        // Arrange
        dataAvailabilityUseCase.execute.mockImplementation(() =>
          Promise.reject(new Error("Some error"))
        );

        // Act
        const res = await request(app).get("/?query=data");

        // Assert
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ has_data: false });
      });
    });
  });

  describe("rate limiting", () => {
    it("should rate limit requests (limit=1 per 10s)", async () => {
      // Arrange
      dbConnectionUseCase.execute.mockImplementation(() =>
        Promise.resolve(true)
      );
      dataAvailabilityUseCase.execute.mockImplementation(() =>
        Promise.resolve(true)
      );

      // Act
      await request(app).get("/");
      const res = await request(app).get("/");

      // Assert
      expect(res.status).toBe(429);
      expect(res.headers["ratelimit-limit"]).toBe("1");
      expect(res.headers["ratelimit-remaining"]).toBe("0");
    });
  });
});
