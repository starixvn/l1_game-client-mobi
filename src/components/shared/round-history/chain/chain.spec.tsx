import { render, fireEvent } from "@testing-library/react";
import React from "react";

import { GameContextProvider } from "../../../../contexts/game-context/game-context";
import ChainRoundHistory from ".";
import { GameState, ViewMode } from "../../../shared/game-base/type";

describe("ChainRoundHistory", () => {
    const roundHistory = [
        { result: { dice1: 5, dice2: 5, dice3: 1 }, roundId: 786275, settlementResult: { big: true, small: false } },
        { result: { dice1: 5, dice2: 5, dice3: 1 }, roundId: 786274, settlementResult: { big: true, small: false } },
        { result: { dice1: 2, dice2: 4, dice3: 1 }, roundId: 786267, settlementResult: { big: false, small: true } },
    ];
    const gameSetting = {
        id: 1,
        gameName: "taixiu",
        supportMD5: false,
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
        gameState: GameState.InRound,
        viewMode: ViewMode.full,
        isShowBlink: false,
        playResultAnimation: true,
    };
    const renderRoundDetail = () => {
        <span>renderRoundDetail</span>;
    };
    const renderGameDot = () => {
        <span>renderGameDot</span>;
    };

    test("should render ChainRoundHistory component", () => {
        // Arrange
        const resource = {
            gameState: GameState.InRound,
            roundHistory,
            renderRoundDetail,
            renderGameDot,
        };

        // Act
        render(
            <GameContextProvider value={gameContext as any}>
                <ChainRoundHistory {...(resource as any)} />
            </GameContextProvider>
        );

        // Arrange
        expect(document.querySelector(".round-dot-wrapper")).toBeTruthy();
        expect(document.querySelector(".dot-wrapper")).toBeTruthy();
    });

    test("show dot blink when game state locking-bet", () => {
        // Arrange
        gameContext.isShowBlink = true;
        const resource = {
            gameState: GameState.LockingBet,
            roundHistory,
            renderRoundDetail,
            renderGameDot,
        };

        // Act
        render(
            <GameContextProvider value={gameContext as any}>
                <ChainRoundHistory {...(resource as any)} />
            </GameContextProvider>
        );

        // Arrange
        expect(document.querySelector(".round-dot-wrapper")).toBeTruthy();
        expect(document.querySelector(".dot-next")).toBeTruthy();
    });

    test("show tooltip when click dot", () => {
        // Arrange
        gameContext.isShowBlink = false;
        const resource = {
            gameState: GameState.InRound,
            roundHistory,
            renderRoundDetail,
            renderGameDot,
        };

        // Act
        const { getAllByTestId } = render(
            <GameContextProvider value={gameContext as any}>
                <ChainRoundHistory {...(resource as any)} />
            </GameContextProvider>
        );
        fireEvent.click(getAllByTestId("dot-wrapper")[0]);

        // Arrange
        expect(document.querySelector(".tooltip")).toBeTruthy();
    });
});
