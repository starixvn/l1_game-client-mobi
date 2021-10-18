import { render, fireEvent } from "@testing-library/react";
import React from "react";
import ErrorCodeDictionary from "../../../common/constants/error-code-dictionary";

import { Notice } from ".";

describe("Notice", () => {
    // Arrange
    const errorCode = 1000;
    const opt = {
        message: "notice",
        gameName: "taixiu",
        roundId: 1,
        minBet: 0,
        maxBet: 2000,
        errorCode: ErrorCodeDictionary[errorCode],
        onClose: jest.fn,
        duration: 3,
        isWarning: true,
    };
    test("renders Notice Warning component", () => {
        // Act
        const { getByTestId } = render(<Notice {...opt} />);
        fireEvent.click(getByTestId("close-btn"));

        // Assert
        expect(document.querySelector(".warning")).toBeTruthy();
    });

    test("renders Notice inform  component", () => {
        // Arrange
        opt.isWarning = false;

        // Act
        const { getByTestId } = render(<Notice {...opt} />);
        fireEvent.click(getByTestId("close-btn"));

        // Assert
        expect(document.querySelector(".inform")).toBeTruthy();
    });
});
