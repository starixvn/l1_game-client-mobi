import { render, fireEvent } from "@testing-library/react";
import React from "react";

import { GameGuideModal } from ".";
import { AuthContextProvider } from "../../../contexts/auth";
import { authContextValue, offerGames } from "../__test__/test-helper";

describe("GameGuideModal", () => {
    test("should render correctly", async () => {
        // Arrange
        const user = {
            UID: 18901,
            avatarId: 37,
            currency: "$US",
            isSignedInSM: true,
            name: "Gold26419",
            offerGames: [{ gameId: 1, maxBet: 2000, maxBetPerChoices: {}, minBet: 1, _id: "617a651528b7a500016388f6" }],
            red: 0,
            settings: { theme: "light", quickBet: false },
        };
        // Act
        const { getByTestId } = render(
            <AuthContextProvider value={authContextValue}>
                <GameGuideModal onCloseModal={jest.fn} offerGames={offerGames} userStakeLevel={null} user={user} promotions={[]} />
            </AuthContextProvider>
        );
        fireEvent.click(getByTestId("icon-close"));

        // Assert

        expect(document.querySelector(".popup")).toBeTruthy();
        expect(document.querySelector(".popup-container")).toBeTruthy();
        expect(document.querySelector(".container-guide")).toBeTruthy();
    });
});
