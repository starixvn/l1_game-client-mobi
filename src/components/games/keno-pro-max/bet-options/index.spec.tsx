import React from "react";
import { render } from "@testing-library/react";
import KenoProMaxBetOptions from "./";
import { GameContextProvider } from "../../../../contexts/game-context/game-context";
import { DefaultGameContext, DefaultSettlementResult } from "../__tests__/test-helper";
import { GameState } from "../../../shared/game-base/type";

const TooltipMessageFollowChoiceProps = {
    big: "[811~1410]",
    small: "[210~810]",
    gold: "[210~695]",
    wood: "[696~763]",
    water: "[764~855]",
    fire: "[856~923]",
    earth: "[924~1410]"
};

describe("KenoProMaxBetOptions tests", () => {
    test("should render correctly", () => {
        render(
            <GameContextProvider value={DefaultGameContext as any}>
                <KenoProMaxBetOptions
                    settlementResult={DefaultSettlementResult}
                    gameState={GameState.InRound}
                    isShowWinningEffect={false}   
                    isShowPoolStake={false}
                    tooltipMessageFollowChoiceProps={TooltipMessageFollowChoiceProps}
                />
            </GameContextProvider>
        );

        expect(document.querySelector(".layout-keno-pro-max")).toBeTruthy();
        expect(document.querySelector(".bet-choice-name")).toBeTruthy();
    });
});
