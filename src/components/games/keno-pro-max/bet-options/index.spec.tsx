import React from "react";
import { render } from "@testing-library/react";
import KenoProMaxBetOptions from "./";
import { GameContextProvider } from "../../../../contexts/game-context/game-context";
import { DefaultGameContext, DefaultSettlementResult } from "../__tests__/test-helper";
import { GameState } from "../../../shared/game-base/type";

describe("KenoProMaxBetOptions tests", () => {
    test("should render correctly", () => {
        render(
            <GameContextProvider value={DefaultGameContext as any}>
                <KenoProMaxBetOptions
                    settlementResult={DefaultSettlementResult}
                    gameState={GameState.InRound}
                    isShowWinningEffect={false}
                />
            </GameContextProvider>
        );

        expect(document.querySelector(".layout-keno-pro-max")).toBeTruthy();
        expect(document.querySelector(".bet-choice-name")).toBeTruthy();
    });
});
