import React from "react";
import { render } from "@testing-library/react";

import { SystemContextProvider } from "../../../contexts/system";
import { GameState } from "../../shared/game-base/type";
import { GameContextProvider } from "../../../contexts/game-context/game-context";
import { ViewMode } from "../../shared/game-base/type";
import { AuthContextProvider } from "../../../contexts/auth";
import { KenoProMax } from "./index";
import { DefaultGameContext, AuthContextValueDefault, SystemContextValue, kenoProps } from "./__tests__/test-helper";

const roundHistory = [
    {
        result: [4, 11, 13, 19, 21, 24, 26, 28, 38, 49, 53, 58, 60, 63, 65, 70, 71, 73, 74, 80],
        roundId: 1018469,
        settlementResult: {
            big: true,
            earth: false,
            even: true,
            fire: true,
            gold: false,
            odd: false,
            small: false,
            water: false,
            wood: false,
        },
    },
];

describe("KenoMatch", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });
    test("should be render correctly with mode view full", () => {
        // Arrange
        class MockKenoMatch extends KenoProMax {
            constructor(props: any) {
                super(props);

                this.state = {
                    signedIn: true,
                    gameState: GameState.DisplayResult,
                    remainingTime: 30,
                    gameConfigs: DefaultGameContext.gameConfigs,
                    roundHistory: roundHistory,
                    roundId: 1,
                    ownBets: {},
                    totalBets: {},
                    displayPopup: null,
                    betPercentage: {},
                    viewMode: ViewMode.full,
                    showResultInfo: true,
                    acceptedBetQueue: {},
                    showWinningAnimation: false,
                    playResultAnimation: false,
                    isShowBlink: false,
                    notice: null,
                    removeBetChoiceFocus: null,
                    betOptionElement: null,
                    betChoiceElement: null,
                    activeScoreboardTab: 0,
                };
            }
        }

        // Act
        render(
            <AuthContextProvider value={AuthContextValueDefault}>
                <SystemContextProvider value={SystemContextValue}>
                    <GameContextProvider value={DefaultGameContext as any}>
                        <MockKenoMatch {...(kenoProps as any)} />
                    </GameContextProvider>
                </SystemContextProvider>
            </AuthContextProvider>
        );

        // Assert
        expect(document.querySelector(".header-right")).toBeTruthy();
        expect(document.querySelector(".header-left")).toBeTruthy();
        expect(document.querySelector(".layout-keno-pro-max")).toBeTruthy();
        expect(document.querySelector(".tabs-container")).toBeTruthy();
        expect(document.querySelector(".round-result")).toBeTruthy();
        expect(document.querySelector(".mini-round-history")).toBeTruthy();
        expect(document.querySelector(".statistic")).toBeTruthy();
        expect(document.querySelector(".score-board-dragon-container")).toBeTruthy();
    });

    test("should be render correctly with mode view full", () => {
        //Arrange
        class MockKenoMatch extends KenoProMax {
            constructor(props: any) {
                super(props);

                this.state = {
                    signedIn: true,
                    gameState: GameState.DisplayResult,
                    remainingTime: 30,
                    gameConfigs: DefaultGameContext.gameConfigs,
                    roundHistory: roundHistory,
                    roundId: 1,
                    ownBets: {},
                    totalBets: {},
                    displayPopup: null,
                    betPercentage: {},
                    viewMode: ViewMode.collapse,
                    showResultInfo: true,
                    acceptedBetQueue: {},
                    showWinningAnimation: false,
                    playResultAnimation: false,
                    isShowBlink: false,
                    notice: null,
                    removeBetChoiceFocus: null,
                    betOptionElement: null,
                    betChoiceElement: null,
                    activeScoreboardTab: 0,
                };
            }
        }
        // Act
        render(
            <AuthContextProvider value={AuthContextValueDefault}>
                <SystemContextProvider value={SystemContextValue}>
                    <GameContextProvider value={DefaultGameContext as any}>
                        <MockKenoMatch {...(kenoProps as any)} />
                    </GameContextProvider>
                </SystemContextProvider>
            </AuthContextProvider>
        );

        // Assert
        expect(document.querySelector(".header-result")).toBeTruthy();
        expect(document.querySelector(".keno-pro-max-collapse")).toBeTruthy();
    });
});
