import { render, screen, fireEvent } from "@testing-library/react";
import React, { useRef } from "react";
import { mocked } from "ts-jest/utils";
import * as rdd from "react-device-detect";

import { Tooltip } from ".";

const useMockRef = mocked(useRef);

describe("Tooltip", () => {
    it("should render Tooltip component", () => {
        // Arrange
        rdd.isDesktop = true;

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
