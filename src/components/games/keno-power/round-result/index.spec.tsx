import { render } from "@testing-library/react";
import React from "react";
import { RoundResult } from ".";
import { GameContextProvider } from "../../../../contexts/game-context/game-context";
import { GameState } from "../../../shared/game-base/type";
import { DefaultGameContext, DefaultResult } from "../__tests__/test-helper";

describe("RoundResult tests", () => {
    test("should render full mode with inRound state correctly", () => {
        render(
            <GameContextProvider value={DefaultGameContext as any}>
                <RoundResult result={DefaultResult} gameState={GameState.InRound} isCollapse={false} />
            </GameContextProvider>
        );

        expect(document.querySelector(".main-result")).toBeTruthy();
        expect(document.querySelector(".middle-column")).toBeTruthy();
        expect(document.querySelector(".team-score")).toBeTruthy();
    });

    test("should render full mode with display result state correctly", () => {
        render(
            <GameContextProvider value={DefaultGameContext as any}>
                <RoundResult result={DefaultResult} gameState={GameState.DisplayResult} isCollapse={false} />
            </GameContextProvider>
        );

        expect(document.querySelector(".main-result")).toBeTruthy();
        expect(document.querySelector(".progress-bar-team")).toBeTruthy();
        expect(document.querySelector(".middle-column")).toBeFalsy();
        expect(document.querySelector(".team-score")).toBeFalsy();
    });

    test("should render collapse mode correctly", () => {
        render(
            <GameContextProvider value={DefaultGameContext as any}>
                <RoundResult result={DefaultResult} gameState={GameState.DisplayResult} isCollapse={true} />
            </GameContextProvider>
        );

        expect(document.querySelector(".result-collapse-mode")).toBeTruthy();
    });
});
