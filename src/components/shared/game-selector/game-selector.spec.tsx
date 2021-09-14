import { fireEvent, render } from "@testing-library/react";
import React from "react";

import GameSelector from ".";

jest.mock("next-i18next", () => ({
    useTranslation: () => {
        return {
            t: (str: string) => str,
            i18n: {
                changeLanguage: () => new Promise(() => {}),
            },
        };
    },
}));

jest.mock("next/config", () => () => ({
    publicRuntimeConfig: {
        offeredGames: [1],
        gameSettings: {
            "1": {
                id: 1,
                gameName: "taixiu",
                socketInfo: {
                    namespace: "taixiu",
                    path: "bigsmall",
                },
                durations: {
                    wholeRound: 62,
                    placingBets: 50,
                    lockingBet: 5,
                    showResult: 8,
                    resultAnimation: 3,
                    beforeStartRound: 0,
                    balancingBet: 3,
                },
            },
        },
    },
}));

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
