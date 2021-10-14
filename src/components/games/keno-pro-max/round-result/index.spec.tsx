import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import React from "react";
import { RoundResult } from ".";
import { RoundResultCollapse } from ".";
import { GameContextProvider } from "../../../../contexts/game-context/game-context";
import { GameState } from "../../../shared/game-base/type";
import { DefaultGameContext, DefaultResult, DefaultSettlementResult } from "../__tests__/test-helper";

describe("RoundResult tests", () => {
    // Fake timers using Jest
    beforeEach(() => {
        jest.useFakeTimers();
    });

    test("should render full mode with inRound state correctly", () => {
        render(
            <GameContextProvider value={DefaultGameContext as any}>
                <RoundResult
                    result={DefaultResult}
                    gameState={GameState.InRound}
                    settlementResult={DefaultSettlementResult}
                    showResultInfo={false}
                />
            </GameContextProvider>
        );

        expect(document.querySelector(".round-result")).toBeTruthy();
        expect(document.querySelector(".keno-pro-max")).toBeTruthy();
        expect(document.querySelector(".winning-info")).toBeTruthy();
    });

    test("should render full mode with display result state correctly", () => {
        render(
            <GameContextProvider value={DefaultGameContext as any}>
                <RoundResult
                    result={DefaultResult}
                    gameState={GameState.DisplayResult}
                    settlementResult={DefaultSettlementResult}
                    showResultInfo={true}
                />
            </GameContextProvider>
        );
        act(() => {
            jest.advanceTimersByTime(100);
        });

        expect(document.querySelector(".round-result")).toBeTruthy();
        expect(document.querySelector(".has-animation")).toBeTruthy();
        expect(document.querySelector(".winning-info")).toBeTruthy();
        expect(document.querySelector(".result-total")).toBeTruthy();
        expect(document.querySelector(".show")).toBeTruthy();
    });

    test("should render full mode with LockingBet state correctly", () => {
        render(
            <GameContextProvider value={DefaultGameContext as any}>
                <RoundResult
                    result={DefaultResult}
                    gameState={GameState.LockingBet}
                    settlementResult={DefaultSettlementResult}
                    showResultInfo={true}
                />
            </GameContextProvider>
        );

        expect(document.querySelector(".round-result")).toBeTruthy();
        expect(document.querySelector(".hide")).toBeTruthy();
    });
});

describe("RoundResult Collapse tests", () => {
    test("should render collapse mode correctly", () => {
        render(
            <GameContextProvider value={DefaultGameContext as any}>
                <RoundResultCollapse
                    result={DefaultResult}
                    settlementResult={DefaultSettlementResult}
                    gameState={GameState.DisplayResult}
                />
            </GameContextProvider>
        );
        expect(document.querySelector(".result-collapse-mode")).toBeTruthy();
    });
});
