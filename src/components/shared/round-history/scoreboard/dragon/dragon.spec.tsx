import { render } from "@testing-library/react";
import React from "react";

import { GameContextProvider } from "../../../../../contexts/game-context/game-context";
import ScoreboardDragon from ".";
import { roundHistory, gameContext } from "../../__tests__/test-helper";

describe("ScoreboardDragon", () => {
    test("should render ScoreboardDragon component", () => {
        // Arrange
        const resource = {
            roundHistory,
            isShowBlink: true,
            dotDetails: {
                translateDotTextMapping: jest.fn(),
                choice: ["big", "small"],
            },
        };

        // Act
        render(
            <GameContextProvider value={gameContext as any}>
                <ScoreboardDragon {...resource} />
            </GameContextProvider>
        );

        // Arrange
        expect(document.querySelector(".score-board-dragon-container")).toBeTruthy();
    });
});
