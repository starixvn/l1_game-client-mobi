import { render } from "@testing-library/react";
import React from "react";
import * as rdd from "react-device-detect";

import GameGuides from ".";
import { AuthContextProvider } from "../../../../contexts/auth";
import { authContextValue } from "../../__test__/test-helper";

describe("GameGuides", () => {
    [1, 22].forEach((gameId) => {
        test("should render correctly", () => {
            // Act
            render(
                <AuthContextProvider value={authContextValue}>
                    <GameGuides gameId={gameId} userStakeLevel={null} />
                </AuthContextProvider>
            );

            // Assert
            expect(document.querySelector(".container-guide")).toBeTruthy();
        });
    });

    test("should render is IOS browser with version 15", () => {
        //Arrange
        rdd.isIOS = true;
        rdd.isMobileOnly = true;
        rdd.browserVersion = 15;
        // Act
        render(
            <AuthContextProvider value={authContextValue}>
                <GameGuides gameId={1} userStakeLevel={null} />
            </AuthContextProvider>
        );

        // Assert
        expect(document.querySelector(".container-guide")).toBeTruthy();
    });
});
