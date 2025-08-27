import { render } from "@testing-library/react";
import React, { useRef } from "react";
import * as rdd from "react-device-detect";

import { Tooltip } from ".";

const useMockRef = jest.mocked(useRef);

// Mock react-device-detect
jest.mock("react-device-detect", () => ({
    isDesktop: true,
}));

describe("Tooltip", () => {
    it("should render Tooltip component", () => {
        // Arrange
        // rdd.isDesktop is already mocked to true

        // Act
        render(<Tooltip message={"Tooltip"} hoverWrapper={useMockRef as any} isShowAtHoverPosition={true} />);

        // Assert
        expect(document.querySelector(".tooltip")).toBeTruthy();
    });

    it("render arrow on component", () => {
        // Act
        render(<Tooltip message={"Tooltip"} hoverWrapper={useMockRef as any} isShowAtHoverPosition={false} />);

        // Assert
        expect(document.querySelector(".arrow")).toBeTruthy();
    });
});
