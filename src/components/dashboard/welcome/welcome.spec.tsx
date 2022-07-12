import { render, fireEvent } from "@testing-library/react";
import React from "react";

import Welcome from ".";

describe("Welcome", () => {
    test("renders Welcome component", async () => {
        // Arrange
        const resource = {
            userInfo: {
                UID: 1,
                avatarId: 1,
                currency: "USD",
                name: "abc",
                red: 2000,
                settings: { theme: "light" },
                isSignedInSM: true,
                offerGames: [22, 2, 9, 1, 4, 8],
            },
            handleFirstLoginSM: jest.fn,
        };
        // Act
        const { getByTestId } = render(<Welcome {...resource} />);
        fireEvent.click(getByTestId("btn-welcome-submit"));

        // Assert
        expect(document.querySelector(".wrapper")).toBeTruthy();
        expect(document.querySelector(".welcome")).toBeTruthy();
        expect(document.querySelector(".btn-submit")).toBeTruthy();
    });
});
