import { render } from "@testing-library/react";
import React from "react";
import { KenoMatchGameStateEnum } from "../type";
import KenoMatchBetOptions from "./";
import { FakeSettlementResult } from "../keno-match-helper";
import { GameState, ViewMode } from "../../../shared/game-base/type";
import { GameContextProvider } from "../../../../contexts/game-context/game-context";

const gameSetting = {
    id: 36,
    gameName: "KenoMatch1",
    socketInfo: {
        namespace: "kenomatch1",
        path: "kenomatch",
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
};

const gameContext = {
    gameSetting: gameSetting,
    totalBets: {},
    ownBets: {},
    roundId: 1,
    remainingTime: 1,
    gameConfigs: {
        minbet: 1,
        maxbet: 2000,
        choices_maxbet: {
            fhBlue: 2000,
            fhRed: 2000,
            fhOver: 2000,
            fhUnder: 2000,
            fhOdd: 2000,
            fhEven: 2000,
            ftBlue: 2000,
            ftRed: 2000,
            ftOver: 2000,
            ftUnder: 2000,
            ftOdd: 2000,
            ftEven: 2000,
        },
        odds: {
            fhBlue: 1.96,
            fhRed: 1.96,
            fhOver: 1.96,
            fhUnder: 1.96,
            fhOdd: 1.96,
            fhEven: 1.96,
            ftBlue: 1.96,
            ftRed: 1.96,
            ftOver: 1.96,
            ftUnder: 1.96,
            ftOdd: 1.96,
            ftEven: 1.96,
        },
        enableFreeBet: false,
    },
    gameState: GameState.DisplayResult,
    viewMode: ViewMode.full,
    isShowBlink: false,
    playResultAnimation: true,
};

const liveOdds = {
        liveFTBlue: 2.54,
        liveFTRed: 1.66,
        liveFTOver: 1.37,
        liveFTUnder: 3.7,
    },
    betOptionsProps = {
        liveOdds,
        gameState: KenoMatchGameStateEnum.HalfTimePlacingBet as number,
        settlementResult: FakeSettlementResult,
        isShowWinningEffect: true,
        isFirstHalf: true,
        beforeStartFulltime: false
    };
    
describe("KenoMatchBetOptions", () => {
    test("should render correctly", () => {
        render(
            <GameContextProvider value={gameContext as any}>
                <KenoMatchBetOptions {...betOptionsProps} />
            </GameContextProvider>
        );

        expect(document.querySelector(".title-wrapper")).toBeTruthy();
        expect(document.querySelector(".title-left")).toBeTruthy();
        expect(document.querySelector(".layout-kenomatch1")).toBeTruthy();
        expect(document.querySelector(".bet-choice-name")).toBeTruthy();
    });
});
