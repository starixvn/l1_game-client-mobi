import "@testing-library/jest-dom";

import { render } from "@testing-library/react";
import React from "react";

import UserInfo from ".";

test("load user info", () => {
    // arrange
    const user = { UID: 1, avatarId: 1, currency: "USD", name: "abc", red: 2000, settings: { theme: "light" }, isSignedInSM: true };

    // act
    const { getByTestId } = render(<UserInfo user={user} />);

    // assert
    expect(getByTestId("user-name")).toHaveTextContent("abc");
});

[null, undefined].forEach((red) => {
    test(`when red of user is ${red}, should 0 as default`, () => {
        // arrange
        const user = { UID: 1, avatarId: 1, currency: "USD", name: "abc", red, settings: { theme: "light" }, isSignedInSM: true };

        // act
        const { getByTestId } = render(<UserInfo user={user} />);

        // assert
        expect(getByTestId("balance")).toHaveTextContent("0 USD");
    });
});

[0, 41].forEach((avatarId) => {
    test("when avatarId invalid, should render default avatar", () => {
        // arrange
        const user = { UID: 1, avatarId, currency: "USD", name: "abc", red: 2000, settings: { theme: "light" }, isSignedInSM: true };

        // act
        const { getByTestId } = render(<UserInfo user={user} />);

        // assert
        expect(getByTestId("icon-user")).toBeTruthy();
    });
});
