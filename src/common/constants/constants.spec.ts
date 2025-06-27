import { jest } from "@jest/globals";

// Mock the local-storage module
jest.mock("../local-storage");

// Mock the app-settings module
jest.mock("../app-settings", () => ({
    getAppSettings: () => ({
        system: "L1",
        appType: 2,
    }),
}));

import { isSabaPlay } from "./index";
import { getLocalStorageItem, localStorageKeys } from "../local-storage";

const mockGetLocalStorageItem = getLocalStorageItem as jest.MockedFunction<typeof getLocalStorageItem>;

describe("isSabaPlay", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("when localStorage has operator value", () => {
        it("should return true when stored operator is 'SP'", () => {
            // Arrange
            mockGetLocalStorageItem.mockReturnValue("SP");

            // Act
            const result = isSabaPlay();

            // Assert
            expect(result).toBe(true);
        });

        it("should return false when stored operator is not 'SP'", () => {
            // Arrange
            mockGetLocalStorageItem.mockReturnValue("VG");

            // Act
            const result = isSabaPlay();

            // Assert
            expect(result).toBe(false);
        });

        it("should prioritize stored operator over parameter when both are provided", () => {
            // Arrange
            mockGetLocalStorageItem.mockReturnValue("OTHER");

            // Act
            const result = isSabaPlay("SP");

            // Assert
            expect(result).toBe(false);
        });

        it("should return true when stored operator is 'SP' regardless of parameter", () => {
            // Arrange
            mockGetLocalStorageItem.mockReturnValue("SP");

            // Act
            const result = isSabaPlay("OTHER");

            // Assert
            expect(result).toBe(true);
        });
    });

    describe("when localStorage is empty or null", () => {
        it("should return true when parameter is 'SP'", () => {
            // Arrange
            mockGetLocalStorageItem.mockReturnValue(null);

            // Act
            const result = isSabaPlay("SP");

            // Assert
            expect(result).toBe(true);
        });

        it("should return false when parameter is not 'SP'", () => {
            // Arrange
            mockGetLocalStorageItem.mockReturnValue(null);

            // Act
            const result = isSabaPlay("OTHER");

            // Assert
            expect(result).toBe(false);
        });

        it("should return false when no parameter is provided", () => {
            // Arrange
            mockGetLocalStorageItem.mockReturnValue(null);

            // Act
            const result = isSabaPlay();

            // Assert
            expect(result).toBe(false);
        });

        it("should return false when parameter is undefined", () => {
            // Arrange
            mockGetLocalStorageItem.mockReturnValue(null);

            // Act
            const result = isSabaPlay(undefined);

            // Assert
            expect(result).toBe(false);
        });
    });

    describe("edge cases", () => {
        it("should handle empty string from localStorage", () => {
            // Arrange
            mockGetLocalStorageItem.mockReturnValue("");

            // Act
            const result = isSabaPlay("SP");

            // Assert
            expect(result).toBe(true);
        });

        it("should handle empty string parameter with null localStorage", () => {
            // Arrange
            mockGetLocalStorageItem.mockReturnValue(null);

            // Act
            const result = isSabaPlay("");

            // Assert
            expect(result).toBe(false);
        });

        it("should be case sensitive", () => {
            // Arrange
            mockGetLocalStorageItem.mockReturnValue("sp");

            // Act
            const result = isSabaPlay();

            // Assert
            expect(result).toBe(false);
        });

        it("should handle whitespace in stored operator", () => {
            // Arrange
            mockGetLocalStorageItem.mockReturnValue(" SP ");

            // Act
            const result = isSabaPlay();

            // Assert
            expect(result).toBe(false);
        });
    });

    describe("localStorage interaction", () => {
        it("should call getLocalStorageItem with correct key", () => {
            // Arrange
            mockGetLocalStorageItem.mockReturnValue("SP");

            // Act
            isSabaPlay();

            // Assert
            expect(mockGetLocalStorageItem).toHaveBeenCalledWith(localStorageKeys.operator);
        });

        it("should call getLocalStorageItem only once per function call", () => {
            // Arrange
            mockGetLocalStorageItem.mockReturnValue("SP");

            // Act
            isSabaPlay("OTHER");

            // Assert
            expect(mockGetLocalStorageItem).toHaveBeenCalledTimes(1);
        });
    });
}); 