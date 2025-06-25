// Mock dependencies first
jest.mock("../../../common/constants", () => ({
    systemName: "l1",
    isL1System: jest.fn(() => false),
    isSabaPlay: jest.fn(() => false),
}));

jest.mock("../../../common/local-storage", () => ({
    getLocalStorageItem: jest.fn(() => null),
    localStorageKeys: {
        operator: "test-operator-key",
    },
}));

import { render } from "@testing-library/react";
import React from "react";
import * as rdd from "react-device-detect";

import FirstLoginContainer from ".";
describe("FirstLoginContainer", () => {
    test.each`
        isMobile | className
        ${true}  | ${".mobile"}
        ${false} | ${".wrapper"}
    `("should render class follow devices", ({ isMobile, className }) => {
        // Arrange
        rdd.isMobileOnly = isMobile;

        // Act
        render(<FirstLoginContainer />);

        // Assert
        expect(document.querySelector(className)).toBeTruthy();
    });
});
