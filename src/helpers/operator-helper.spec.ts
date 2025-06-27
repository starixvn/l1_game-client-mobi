import { jest } from "@jest/globals";

// Mock the local-storage module
jest.mock("../common/local-storage");

import { getOperator } from "./operator-helper";
import { getLocalStorageItem, localStorageKeys, storeLocalStorageItem } from "../common/local-storage";

const mockGetLocalStorageItem = getLocalStorageItem as jest.MockedFunction<typeof getLocalStorageItem>;
const mockStoreLocalStorageItem = storeLocalStorageItem as jest.MockedFunction<typeof storeLocalStorageItem>;

describe("operator-helper", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getOperator", () => {
        describe("when query parameter is provided", () => {
            it("should convert lowercase 'sp' to uppercase 'SP' and store it", () => {
                // Arrange & Act
                const result = getOperator("sp");

                // Assert
                expect(result).toBe("SP");
                expect(mockStoreLocalStorageItem).toHaveBeenCalledWith(localStorageKeys.operator, "SP");
            });

            it("should convert uppercase 'SP' to uppercase 'SP' and store it", () => {
                // Arrange & Act
                const result = getOperator("SP");

                // Assert
                expect(result).toBe("SP");
                expect(mockStoreLocalStorageItem).toHaveBeenCalledWith(localStorageKeys.operator, "SP");
            });

            it("should convert mixed case 'Sp' to uppercase 'SP' and store it", () => {
                // Arrange & Act
                const result = getOperator("Sp");

                // Assert
                expect(result).toBe("SP");
                expect(mockStoreLocalStorageItem).toHaveBeenCalledWith(localStorageKeys.operator, "SP");
            });

            it("should convert mixed case 'sP' to uppercase 'SP' and store it", () => {
                // Arrange & Act
                const result = getOperator("sP");

                // Assert
                expect(result).toBe("SP");
                expect(mockStoreLocalStorageItem).toHaveBeenCalledWith(localStorageKeys.operator, "SP");
            });

            it("should handle 'vg' and convert to 'VG'", () => {
                // Arrange & Act
                const result = getOperator("vg");

                // Assert
                expect(result).toBe("VG");
                expect(mockStoreLocalStorageItem).toHaveBeenCalledWith(localStorageKeys.operator, "VG");
            });

            it("should handle mixed case 'VgAmInG' and convert to 'VGAMING'", () => {
                // Arrange & Act
                const result = getOperator("VgAmInG");

                // Assert
                expect(result).toBe("VGAMING");
                expect(mockStoreLocalStorageItem).toHaveBeenCalledWith(localStorageKeys.operator, "VGAMING");
            });

            it("should not call getLocalStorageItem when query parameter exists", () => {
                // Arrange & Act
                getOperator("sp");

                // Assert
                expect(mockGetLocalStorageItem).not.toHaveBeenCalled();
            });
        });

        describe("when query parameter is not provided", () => {
            it("should return stored operator from localStorage", () => {
                // Arrange
                mockGetLocalStorageItem.mockReturnValue("SP");

                // Act
                const result = getOperator();

                // Assert
                expect(result).toBe("SP");
                expect(mockGetLocalStorageItem).toHaveBeenCalledWith(localStorageKeys.operator);
                expect(mockStoreLocalStorageItem).not.toHaveBeenCalled();
            });

            it("should return null when localStorage is empty", () => {
                // Arrange
                mockGetLocalStorageItem.mockReturnValue(null);

                // Act
                const result = getOperator();

                // Assert
                expect(result).toBe(null);
                expect(mockGetLocalStorageItem).toHaveBeenCalledWith(localStorageKeys.operator);
                expect(mockStoreLocalStorageItem).not.toHaveBeenCalled();
            });

            it("should return undefined when localStorage returns undefined", () => {
                // Arrange
                mockGetLocalStorageItem.mockReturnValue(undefined);

                // Act
                const result = getOperator(undefined);

                // Assert
                expect(result).toBe(undefined);
                expect(mockGetLocalStorageItem).toHaveBeenCalledWith(localStorageKeys.operator);
            });
        });

        describe("edge cases with query parameter", () => {
            it("should handle empty string parameter by falling back to localStorage", () => {
                // Arrange
                mockGetLocalStorageItem.mockReturnValue("VG");

                // Act
                const result = getOperator("");

                // Assert
                expect(result).toBe("VG");
                expect(mockGetLocalStorageItem).toHaveBeenCalledWith(localStorageKeys.operator);
                expect(mockStoreLocalStorageItem).not.toHaveBeenCalled();
            });

            it("should handle whitespace in parameter", () => {
                // Arrange & Act
                const result = getOperator(" sp ");

                // Assert
                expect(result).toBe(" SP ");
                expect(mockStoreLocalStorageItem).toHaveBeenCalledWith(localStorageKeys.operator, " SP ");
            });

            it("should handle numeric string parameter", () => {
                // Arrange & Act
                const result = getOperator("123");

                // Assert
                expect(result).toBe("123");
                expect(mockStoreLocalStorageItem).toHaveBeenCalledWith(localStorageKeys.operator, "123");
            });

            it("should handle special characters in parameter", () => {
                // Arrange & Act
                const result = getOperator("sp-test");

                // Assert
                expect(result).toBe("SP-TEST");
                expect(mockStoreLocalStorageItem).toHaveBeenCalledWith(localStorageKeys.operator, "SP-TEST");
            });
        });

        describe("real-world scenarios", () => {
            const realWorldCases = [
                { input: "sp", expected: "SP", description: "lowercase sabaplay" },
                { input: "SP", expected: "SP", description: "uppercase sabaplay" },
                { input: "vg", expected: "VG", description: "lowercase vgaming" },
                { input: "VG", expected: "VG", description: "uppercase vgaming" },
                { input: "Sp", expected: "SP", description: "title case sabaplay" },
                { input: "vG", expected: "VG", description: "mixed case vgaming" },
            ];

            realWorldCases.forEach(({ input, expected, description }) => {
                it(`should handle ${description}: '${input}' -> '${expected}'`, () => {
                    // Arrange & Act
                    const result = getOperator(input);

                    // Assert
                    expect(result).toBe(expected);
                    expect(mockStoreLocalStorageItem).toHaveBeenCalledWith(localStorageKeys.operator, expected);
                });
            });
        });

        describe("localStorage interaction", () => {
            it("should store operator in localStorage with correct key when query parameter is provided", () => {
                // Arrange & Act
                getOperator("sp");

                // Assert
                expect(mockStoreLocalStorageItem).toHaveBeenCalledWith(localStorageKeys.operator, "SP");
                expect(mockStoreLocalStorageItem).toHaveBeenCalledTimes(1);
            });

            it("should retrieve from localStorage with correct key when query parameter is not provided", () => {
                // Arrange
                mockGetLocalStorageItem.mockReturnValue("VG");

                // Act
                getOperator();

                // Assert
                expect(mockGetLocalStorageItem).toHaveBeenCalledWith(localStorageKeys.operator);
                expect(mockGetLocalStorageItem).toHaveBeenCalledTimes(1);
            });

            it("should prioritize query parameter over localStorage value", () => {
                // Arrange - even if localStorage would have a value, query parameter should take precedence
                mockGetLocalStorageItem.mockReturnValue("VG");

                // Act
                const result = getOperator("sp");

                // Assert
                expect(result).toBe("SP");
                expect(mockStoreLocalStorageItem).toHaveBeenCalledWith(localStorageKeys.operator, "SP");
                expect(mockGetLocalStorageItem).not.toHaveBeenCalled();
            });
        });
    });
}); 