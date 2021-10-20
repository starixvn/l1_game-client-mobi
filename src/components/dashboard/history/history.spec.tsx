import { render, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import axios from "axios";

import { AuthContextProvider } from "../../../contexts/auth";
import { HistoryModal } from ".";

jest.mock("axios");
describe("HistoryModal", () => {
    // Arrange
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
    const offerGames = [22, 2, 9, 1, 4, 8, 24, 3, 7, 27, 10, 35, 36, 37, 40, 41];

    test("should render correctly", async () => {
        // Act
        const { getByTestId, getAllByTestId } = render(
            <AuthContextProvider value={authContextValue}>
                <HistoryModal onCloseModal={jest.fn} offerGames={offerGames} />
            </AuthContextProvider>
        );
        fireEvent.click(getByTestId("icon-close"));

        // Assert

        await waitFor(() => expect(document.querySelector(".history-content")).toBeTruthy());
    });

    test.each`
        optionOrder | expectedResult
        ${0}        | ${"vipsedie:game_name"}
        ${1}        | ${"xocxoc:game_name"}
        ${2}        | ${"minisedie:game_name"}
        ${3}        | ${"taixiu:game_name"}
        ${4}        | ${"txturbo:game_name"}
        ${5}        | ${"kenopromax:game_name"}
        ${6}        | ${"specialsedie:game_name"}
        ${7}        | ${"baucua:game_name"}
        ${8}        | ${"dragontiger:game_name"}
        ${9}        | ${"vipbaccarat:game_name"}
        ${10}       | ${"baccarat:game_name"}
        ${11}       | ${"threecards:game_name"}
        ${12}       | ${"kenomatch1:game_name"}
        ${13}       | ${"kenomatch2:game_name"}
    `("render each Component History when selected game selector", async ({ optionOrder, expectedResult }) => {
        // Act
        const { getByTestId, getAllByTestId } = render(
            <AuthContextProvider value={authContextValue}>
                <HistoryModal onCloseModal={jest.fn} offerGames={offerGames} />
            </AuthContextProvider>
        );
        fireEvent.click(getByTestId("selected-item"));
        const dropdownGameName = getAllByTestId("dropdown-item");
        fireEvent.click(dropdownGameName[optionOrder]);

        // Assert
        await waitFor(() => {
            expect(getByTestId("selected-item")).toHaveTextContent(expectedResult);
        });
    });
});
