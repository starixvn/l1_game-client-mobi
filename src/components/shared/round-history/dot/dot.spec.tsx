import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

import { RoundDot, RoundDotGrid } from ".";

describe("Round Dot", () => {
    test("should render component", () => {
        // arrange
        const resource = { choice: "even", value: "Even", highlight: true, size: "large" };
        // act
        const { getByTestId } = render(<RoundDot {...resource} />);

        // assert
        expect(getByTestId("round-dot")).toBeTruthy();
        expect(getByTestId("round-dot")).toHaveTextContent("Even");
        expect(document.getElementsByClassName("highlight-current-result").length).toBe(1);
        expect(document.getElementsByClassName(resource.size).length).toBe(1);
    });
});

describe("Round Dot Grid", () => {
    test("should render component", () => {
        // arrange
        const resource = { choice: "even", value: 1, row: 0, col: 1 };
        // act
        const { getByTestId } = render(<RoundDotGrid {...resource} />);

        // assert
        expect(getByTestId("round-dot-grid")).toBeTruthy();
        expect(getByTestId("round-dot-grid")).toHaveTextContent("1");
        expect(getByTestId("round-dot-grid")).toHaveStyle(`grid-column-start: ${resource.col}; grid-row-start: ${resource.row};`);
        // screen.debug();
    });
});
