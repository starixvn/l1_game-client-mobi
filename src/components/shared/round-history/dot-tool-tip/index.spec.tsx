import "@testing-library/jest-dom";
import { render, fireEvent } from "@testing-library/react";

import { ContainerToolTip } from ".";

describe("MiniItem Next", () => {
    test("should render component", () => {
        // Arrange
        const resource = {
            isOpen: true,
            onClose: jest.fn,
        };

        // Act
        const { getByTestId } = render(<ContainerToolTip {...resource} />);
        fireEvent.mouseDown(getByTestId("tooltip-inner"));

        // Assert
        expect(document.querySelector(".tooltip")).toBeTruthy();
        expect(document.querySelector(".tooltip-inner")).toBeTruthy();
    });
});
