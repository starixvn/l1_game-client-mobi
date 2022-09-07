import { render } from "@testing-library/react";
import React from "react";

import Header from ".";

jest.mock("../../common/constants", () => ({
    systemName: () => {
        "l1";
    },
    isL1System: () => {},
}));

describe("Header", () => {
    const props = {
        user: { UID: 1, name: "name", avatarId: 1, currency: "UUS", red: 2000, isSignedInSM: true, settings: { theme: "light" } },
        enabledSound: true,
        enabledNotification: true,
        onToggleSound: () => {},
        onToggleNotification: () => {},
        toggleHistoryModal: () => {},
        toggleAnnouncementModal: () => {},
        toggleGuideModal: () => {},
        updateFavoriteGames: () => {},
        favoriteGames: [],
        promotionNotifications: [],
    };
    test("renders Header component", () => {
        const { getByTestId } = render(<Header {...props} />);

        expect(getByTestId("header")).toBeInTheDocument();
    });
});
