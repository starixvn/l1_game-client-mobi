import { render } from "@testing-library/react";
import React from "react";

import KenoMatchBetHistory, { detectStateRound } from "./";
import { AuthContextProvider } from "../../../../contexts/auth";

describe("KenoMatch BetHistory", () => {
    test("should render correctly", () => {
        // Arrange
        const resource = {
            gameId: 36,
            isRefund: false,
            renderResultDetail: null,
            closeModal: null,
            renderBetLogsDetail: null,
            nameHeaderOnTable: ["roundTime", "round", "totalStake", "win"],
        };
        const session = { isAuthenticated: true, username: "roger.le", language: "en-US", ss: "test123" };
        const authContextValue = { session: session, setBalance: null };

        // Act
        const { getByTestId } = render(
            <AuthContextProvider value={authContextValue}>
                <KenoMatchBetHistory {...resource}></KenoMatchBetHistory>
            </AuthContextProvider>
        );

        // Assert
        expect(getByTestId("bet-history-loading")).toBeInTheDocument();
    });
});

describe("Check render correct state round on game", () => {
    test.each`
        choice      | expectedResult
        ${"ht"}     | ${0}
        ${"ft"}     | ${1}
        ${"liveFT"} | ${2}
        ${"tt"}     | ${0}
    `("should render state correctly", ({ choice, expectedResult }) => {
        expect(detectStateRound(choice)).toBe(expectedResult);
    });
});
