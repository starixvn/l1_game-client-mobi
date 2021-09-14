import { render } from "@testing-library/react";
import React from "react";

import GameHeader from ".";
import { GameContextProvider } from "../../../contexts/game-context/game-context";
import { SystemContextProvider } from "../../../contexts/system";
import { GameState, ViewMode } from "../game-base/type";

describe("GameHeader", () => {
    // arrange
    const isShowCollapse = false;
    const isUpdateDisableRebet = false;
    const countdownTimerComponent = null;
    const gameSetting = {
        id: 1,
        gameName: "taixiu",
        socketInfo: {
            namespace: "taixiu",
            path: "bigsmall",
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
        gameConfigs: {},
        gameState: GameState.DisplayResult,
        viewMode: ViewMode.full,
        isShowBlink: false,
        playResultAnimation: true,
    };

    const systemContext = {
        setFavorite: null,
        favoriteGames: [],
        enabledPlaySound: true,
        gamesOrder: [],
        userStakeLevel: { minBet: 1, maxBet: 2000 },
        betValue: 10,
        enabledQuickBet: true,
    };

    test("renders GameHeader component", () => {
        const { getByTestId } = render(
            <SystemContextProvider value={systemContext}>
                <GameContextProvider value={gameContext}>
                    <GameHeader
                        isShowCollapse={isShowCollapse}
                        isUpdateDisableRebet={isUpdateDisableRebet}
                        countdownTimerComponent={countdownTimerComponent}
                    />
                </GameContextProvider>
            </SystemContextProvider>
        );

        expect(getByTestId("header")).toBeInTheDocument();
    });
});
