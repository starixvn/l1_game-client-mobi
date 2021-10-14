import { render } from "@testing-library/react";
import React from "react";

import KenoMatchBetHistory from "./";
import { AuthContextProvider } from "../../../contexts/auth";

describe("KenoMatch BetHistory", () => {
    test("should render correctly", () => {
        // Arrange
        const resource = {
            gameId: 36,
            isRefund: false,
            renderResultDetail: null,
            closeModal: null,
            renderBetLogsDetail: null,
            nameHeaderOnTable: ["roundTime", "round", "totalStake", "onlyRefund", "win"],
        };

        const session = {
            isAuthenticated: true,
            username: "roger.le",
            language: "en-US",
            ss: "test123",
            memberName: "",
            isUM: false,
            umInfo: { startTime: null, endTime: null },
        };

        const authContextValue = { session: session, setBalance: jest.fn };
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
