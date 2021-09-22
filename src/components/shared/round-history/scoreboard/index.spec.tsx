import "@testing-library/jest-dom";
import { render, fireEvent } from "@testing-library/react";

import ScoreboardRoundHistory from ".";
import ScoreboardDragon from "../scoreboard/dragon";

describe("ScoreboardRound History", () => {
    test("should render component", () => {
        // Arrange
        const activeScoreboardTab = 0;

        // Act
        render(
            <ScoreboardRoundHistory activeScoreboardTab={activeScoreboardTab}>
                <ScoreboardDragon roundHistory={[]} />
            </ScoreboardRoundHistory>
        );

        // Assert
        expect(document.querySelector(".board")).toBeTruthy();
        expect(document.querySelector(".score-board-dragon-container")).toBeTruthy();
    });

    test("scroll scoreboard to end right", () => {
        // Arrange
        const activeScoreboardTab = 1;

        // Act
        render(
            <ScoreboardRoundHistory activeScoreboardTab={activeScoreboardTab}>
                <ScoreboardDragon roundHistory={[]} />
            </ScoreboardRoundHistory>
        );

        // Assert
        expect(document.querySelector(".board")).toBeTruthy();
    });

    test("start scroll scoreboard", () => {
        // Arrange
        const activeScoreboardTab = 1;

        // Act
        const { getByTestId } = render(
            <ScoreboardRoundHistory activeScoreboardTab={activeScoreboardTab}>
                <ScoreboardDragon roundHistory={[]} />
            </ScoreboardRoundHistory>
        );
        fireEvent.mouseDown(getByTestId("board"));
        fireEvent.mouseMove(getByTestId("board"));

        // Assert
        expect(document.querySelector(".board")).toBeTruthy();
    });

    test("stop scroll scoreboard", () => {
        // Arrange
        const activeScoreboardTab = 1;

        // Act
        const { getByTestId } = render(
            <ScoreboardRoundHistory activeScoreboardTab={activeScoreboardTab}>
                <ScoreboardDragon roundHistory={[]} />
            </ScoreboardRoundHistory>
        );
        fireEvent.mouseUp(getByTestId("board"));
        fireEvent.mouseLeave(getByTestId("board"));

        // Assert
        expect(document.querySelector(".board")).toBeTruthy();
    });

    test("touch scroll scoreboard on mobile", () => {
        // Arrange
        const activeScoreboardTab = 1;

        // Act
        const { getByTestId } = render(
            <ScoreboardRoundHistory activeScoreboardTab={activeScoreboardTab}>
                <ScoreboardDragon roundHistory={[]} />
            </ScoreboardRoundHistory>
        );
        fireEvent.touchEnd(getByTestId("board"));

        // Assert
        expect(document.querySelector(".board")).toBeTruthy();
    });
});
