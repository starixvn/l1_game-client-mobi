import { render, fireEvent } from "@testing-library/react";
import React from "react";

import ThemeSelection from ".";

describe("ThemeSelection", () => {
    test.each`
        className
        ${"btn-light"}
        ${"checked-light"}
        ${"btn-dark"}
        ${"checked-dark"}
    `("should render class follow devices", ({ className }) => {
        // Act
        const { getByTestId } = render(<ThemeSelection />);
        fireEvent.click(getByTestId(className));

        // Assert
        expect(document.querySelector(".theme-container")).toBeTruthy();
        expect(document.querySelector(".theme-light-icon")).toBeTruthy();
        expect(document.querySelector(".theme-dark-icon")).toBeTruthy();
        expect(document.querySelector(".radio-button")).toBeTruthy();
        expect(document.querySelector(".radio-label")).toBeTruthy();
    });
});
