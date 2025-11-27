import { describe, it, expect, beforeEach, afterEach, jest } from "@jest/globals";
import type { HealthCheckRepository } from "../../src/application/healthCheckRepository.js";
import { CheckDataAvailabilityUseCase } from "../../src/application/checkDataAvailabilityUseCase.js";

describe("CheckDataAvailabilityUseCase", () => {
  let useCase: CheckDataAvailabilityUseCase;
  let mockRepository: jest.Mocked<HealthCheckRepository>;

  beforeEach(() => {
    // Mock repository with proper type safety
      mockRepository = {
        hasRequiredData: jest.fn(),
        isDatabaseConnected: jest.fn(),
      } as jest.Mocked<HealthCheckRepository>;

    useCase = new CheckDataAvailabilityUseCase(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("execute", () => {
    it("should return true when repository returns true", async () => {
      // Arrange
      mockRepository.hasRequiredData.mockResolvedValue(true);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toBe(true);
      expect(mockRepository.hasRequiredData).toHaveBeenCalledTimes(1);
    });

    it("should return false when repository returns false", async () => {
      // Arrange
      mockRepository.hasRequiredData.mockResolvedValue(false);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toBe(false);
      expect(mockRepository.hasRequiredData).toHaveBeenCalledTimes(1);
    });

    it("should return false when repository throws an error", async () => {
      // Arrange
      mockRepository.hasRequiredData.mockRejectedValue(
        new Error("Some error")
      );

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toBe(false);
      expect(mockRepository.hasRequiredData).toHaveBeenCalledTimes(1);
    });

    it("should handle repository throwing non-Error objects", async () => {
      // Arrange
      mockRepository.hasRequiredData.mockRejectedValue(
        "Unexpected error string"
      );

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toBe(false);
      expect(mockRepository.hasRequiredData).toHaveBeenCalledTimes(1);
    });
  });
});
