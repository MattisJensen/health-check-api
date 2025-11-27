import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from "@jest/globals";
import type { HealthCheckRepository } from "../../src/application/healthCheckRepository.js";
import { CheckDatabaseConnectionUseCase } from "../../src/application/checkDatabaseConnectionUseCase.js";

describe("CheckDatabaseConnectionUseCase", () => {
  let useCase: CheckDatabaseConnectionUseCase;
  let mockRepository: jest.Mocked<HealthCheckRepository>;

  beforeEach(() => {
    // Mock repository with proper type safety
    mockRepository = {
      hasRequiredData: jest.fn(),
      isDatabaseConnected: jest.fn(),
    } as jest.Mocked<HealthCheckRepository>;

    useCase = new CheckDatabaseConnectionUseCase(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("execute", () => {
    describe("responds correctly", () => {
      it("should return true when repository returns true", async () => {
        // Arrange
        mockRepository.isDatabaseConnected.mockResolvedValue(true);

        // Act
        const result = await useCase.execute();

        // Assert
        expect(result).toBe(true);
        expect(mockRepository.isDatabaseConnected).toHaveBeenCalledTimes(1);
      });

      it("should return false when repository returns false", async () => {
        // Arrange
        mockRepository.isDatabaseConnected.mockResolvedValue(false);

        // Act
        const result = await useCase.execute();

        // Assert
        expect(result).toBe(false);
        expect(mockRepository.isDatabaseConnected).toHaveBeenCalledTimes(1);
      });
    });

    describe("handles errors", () => {
      it("should return false when repository throws an error", async () => {
        // Arrange
        mockRepository.isDatabaseConnected.mockRejectedValue(
          new Error("Connection error")
        );

        // Act
        const result = await useCase.execute();

        // Assert
        expect(result).toBe(false);
        expect(mockRepository.isDatabaseConnected).toHaveBeenCalledTimes(1);
      });

      it("should return false when repository throws non-Error objects", async () => {
        // Arrange
        mockRepository.isDatabaseConnected.mockRejectedValue(
          "Connection failed"
        );

        // Act
        const result = await useCase.execute();

        // Assert
        expect(result).toBe(false);
        expect(mockRepository.isDatabaseConnected).toHaveBeenCalledTimes(1);
      });
    });

    describe("delayed responses", () => {
      it("should handle repository returning delayed response", async () => {
        // Arrange
        mockRepository.isDatabaseConnected.mockImplementation(
          () => new Promise((resolve) => setTimeout(() => resolve(true), 1000))
        );

        // Act & Assert
        await expect(useCase.execute()).resolves.toBe(true);
        expect(mockRepository.isDatabaseConnected).toHaveBeenCalledTimes(1);
      });
    });
  });
});
