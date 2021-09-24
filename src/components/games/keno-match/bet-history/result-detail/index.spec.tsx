import { render } from "@testing-library/react";
import React from "react";
import { useTranslation } from "next-i18next";

import ResultDetail from "./";
import { GameContextProvider } from "../../../../../contexts/game-context/game-context";
import appSettings from "../../../../../common/app-settings";

describe("KenoMatch BetHistory", () => {
    describe("Users have  bet, should render data on bet-history ", () => {
        // Arrange
        const { gameSettings } = appSettings;
        const gameContext = {
            gameSetting: gameSettings[36],
            totalBets: {},
            ownBets: {},
            roundId: 1,
            remainingTime: 1,
            gameConfigs: null,
            gameState: 0,
            viewMode: 0,
            isShowBlink: false,
            playResultAnimation: true,
        };
        const gameName = "kenomatch1";
        const firstHalf = {
            result: { blue: [14, 32, 34, 35, 41, 60, 66, 68, 72, 80], red: [3, 7, 22, 27, 43, 44, 56, 63, 64, 66] },
            settlementResult: { blue: true, even: false, odd: true, over: true, red: false, tie: false, under: false },
            sum: 897,
        };
        const fullTime = {
            result: { blue: [21, 24, 25, 32, 51, 52, 56, 64, 75, 77], red: [3, 6, 28, 33, 34, 44, 46, 50, 51, 64] },
            settlementResult: { blue: true, even: false, odd: true, over: true, red: false, tie: false, under: false },
            sum: 897,
        };
        const resultDetail = { bet: { firstHalf: firstHalf, fullTime: fullTime }, roundId: 23230 };
        const { t } = useTranslation(["bethistory", gameName]);

        test("should render correctly", () => {
            // Act
            const { getByTestId, getAllByTestId } = render(
                <GameContextProvider value={gameContext}>{ResultDetail(resultDetail, t, null, gameName)}</GameContextProvider>
            );

            // Assert
            expect(getByTestId("result-details")).toBeInTheDocument();
            expect(getAllByTestId("score-round").length).toBe(2);
            expect(getAllByTestId("winning-info").length).toBe(4);
        });
    });

    describe("Without render component ResultDetail ", () => {
        // Arrange
        const gameName = "";
        const { t } = useTranslation(["bethistory", gameName]);
        const resultDetail = null;

        test("should render correctly", () => {
            // Act
            render(ResultDetail(resultDetail, t, null, gameName));

            // Assert
            expect(document.querySelector(".result-details")).toBeNull();
        });
    });
});
