import { render, screen } from "@testing-library/react";
import React from "react";

import BallsNumbers from "./";
describe("BallsNumbers", () => {
    test("should be have `number` class", () => {
        render(<BallsNumbers number={5} />);
        expect(screen.getByTestId("balls-numbers")).toHaveClass("number");
    });

    test.each`
        result | expectedInnerHtml
        ${5}   | ${"5"}
        ${-1}  | ${"-1"}
        ${""}  | ${""}
    `("should render inner html correctly", ({ result, expectedInnerHtml }) => {
        render(<BallsNumbers number={result} />);

        expect(screen.getByTestId("balls-numbers").innerHTML).toEqual(expectedInnerHtml);
    });
});

test("BallsNumbers should be render correctly", () => {
    render(<BallsNumbers number={5} />);
    const component = screen.getByTestId("balls-numbers");

    expect(component.innerHTML).toEqual("5");
    expect(component).toHaveClass("number");
});
