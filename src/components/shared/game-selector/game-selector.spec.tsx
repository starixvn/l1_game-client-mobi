import { fireEvent, render } from "@testing-library/react";
import React from "react";

import GameSelector from ".";

describe("GameSelector", () => {
    // arrange
    const onChangeGame = jest.fn();
    const selectedGame = 1;
    const offerGames = [22];

    test("renders GameSelector component", () => {
        // act
        const { getByTestId } = render(<GameSelector onChangeGame={onChangeGame} selectedGame={selectedGame} offerGames={offerGames} />);

        // arrange
        expect(getByTestId("game-selector")).toBeInTheDocument();
    });

    test("should render dropdown menu when click on selected item", () => {
        // act
        const { getByTestId } = render(<GameSelector onChangeGame={onChangeGame} selectedGame={selectedGame} offerGames={offerGames} />);

        fireEvent.click(getByTestId("selected-item"));

        // arrange
        expect(getByTestId("dropdown-menu")).toBeInTheDocument();
    });
});
