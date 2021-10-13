import React from "react";
import { render } from "@testing-library/react";
import KenoPowerOptions from "./";
import { GameContextProvider } from "../../../../contexts/game-context/game-context";
import { DefaultGameContext, DefaultSettlementResult } from "../__tests__/test-helper";
import { GameState } from "../../../shared/game-base/type";

describe("KenoPowerOptions tests", () => {
    test("should render correctly", () => {
        render(
            <GameContextProvider value={DefaultGameContext as any}>
                <KenoPowerOptions settlementResult={DefaultSettlementResult} gameState={GameState.InRound} isShowWinningEffect={false} />
            </GameContextProvider>
        );

        expect(document.querySelector(".layout-keno-power")).toBeTruthy();
        expect(document.querySelector(".sum-choice-area")).toBeTruthy();
        expect(document.querySelector(".team-choice-area-blue")).toBeTruthy();
        expect(document.querySelector(".team-choice-area-red")).toBeTruthy();
    });
});
