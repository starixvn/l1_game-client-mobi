import { render, screen } from "@testing-library/react";
import React from "react";

import BetHistoryDetailsContainer from ".";

describe("BetHistoryDetailsContainer", () => {
    // Arrange
    const resource = {
        renderBetLogsDetails: null,
        renderResultDetail: null,
        isShowResultDetail: false,
        closeModalBetHistory: null,
        closeModalBetDetails: null,
        translateText: { betDetails: "Bet Details" },
    };

    test("should render correctly", () => {
        // Act
        const { getByTestId } = render(<BetHistoryDetailsContainer {...resource} />);

        // Assert
        expect(getByTestId("bet-history-details")).toBeInTheDocument();
    });

    test("should render icon back", () => {
        // Act
        const { getByAltText } = render(<BetHistoryDetailsContainer {...resource} />);

        // Assert
        expect(getByAltText("arrow-left")).toBeInTheDocument();
    });

    test("should render icon close", () => {
        // Act
        const { getByTestId } = render(<BetHistoryDetailsContainer {...resource} />);

        // Assert
        expect(getByTestId("icon-close")).toBeInTheDocument();
    });
});
