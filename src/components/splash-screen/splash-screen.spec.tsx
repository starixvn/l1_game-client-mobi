import { render } from "@testing-library/react";
import React from "react";

import SplashScreen from ".";
import { locales } from "../../common/constants";

jest.mock("../../common/local-storage", () => ({
    getLocalStorageItem: jest.fn(() => null),
    localStorageKeys: {
        operator: "test-operator-key",
    },
}));

jest.mock("../../common/constants", () => ({
    systemName: "l1",
    isL1System: () => {
        return "l1";
    },
    locales: { vi: "vi" },
    buildVersion: "1.0.0",
    isSabaPlay: jest.fn(() => false),
}));

describe("Splash screen", () => {
    ["en", "vi"].forEach((locale) => {
        it("should render logo", () => {
            const { getByAltText } = render(<SplashScreen locale={locale} />);
            console.log("getByAltText", getByAltText);
            expect(getByAltText("Logo")).toBeInTheDocument();
        });
    });

    it("should render intro image when local is vn", () => {
        const { getByAltText } = render(<SplashScreen locale={locales.vi} />);

        expect(getByAltText("Info")).toBeInTheDocument();
    });

    it("render empty component", () => {
        const { getByAltText } = render(<SplashScreen locale={undefined} />);

        expect(document.querySelector(".page")).toBeNull();
    });
});
