import { render } from "@testing-library/react";
import React from "react";

import { GameContextProvider } from "../../../../../contexts/game-context/game-context";
import ScoreboardBasic from ".";
import { GameState } from "../../../../shared/game-base/type";
import { roundHistory, gameContext } from "../../__tests__/test-helper";

describe("ScoreboardBasic", () => {
    const getDotDetails = () => {
        <span>getDotDetails</span>;
    };

    test("should render ScoreboardBasic component", () => {
        // Arrange
        const resource = {
            gameState: GameState.InRound,
            roundHistory,
            getDotDetails,
        };

        // Act
        render(
            <GameContextProvider value={gameContext as any}>
                <ScoreboardBasic {...resource} />
            </GameContextProvider>
        );

        // Arrange
        expect(document.querySelector(".score-board-container")).toBeTruthy();
    });
});
