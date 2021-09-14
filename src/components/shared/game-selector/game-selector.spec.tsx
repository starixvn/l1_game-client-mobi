import { fireEvent, render } from "@testing-library/react";
import React from "react";

import GameSelector from ".";

describe("GameSelector", () => {
    // arrange
    const onChangeGame = jest.fn();
    const selectedGame = 1;

    test("renders GameSelector component", () => {
        // act
        const { getByTestId } = render(<GameSelector onChangeGame={onChangeGame} selectedGame={selectedGame} />);

        // arrange
        expect(getByTestId("game-selector")).toBeInTheDocument();
    });

    test("should render dropdown menu when click on selected item", () => {
        // act
        const { getByTestId } = render(<GameSelector onChangeGame={onChangeGame} selectedGame={selectedGame} />);

        fireEvent.click(getByTestId("selected-item"));

        // arrange
        expect(getByTestId("dropdown-menu")).toBeInTheDocument();
    });
});
