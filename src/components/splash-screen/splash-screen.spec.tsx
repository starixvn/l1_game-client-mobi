import { render } from "@testing-library/react";
import React from "react";

import SplashScreen from ".";
import { locales } from "../../common/constants";

describe("Splash screen", () => {
    ["en", "vi"].forEach((locale) => {
        it("should render logo", () => {
            const { getByAltText } = render(<SplashScreen locale={locale} />);

            expect(getByAltText("Logo")).toHaveClass("logo");
        });
    });

    it("should render intro image when local is vn", () => {
        const { getByAltText } = render(<SplashScreen locale={locales.vi} />);

        expect(getByAltText("Info")).toHaveClass("info");
    });

    it("render empty component", () => {
        const { getByAltText } = render(<SplashScreen locale={undefined} />);

        expect(document.querySelector(".page")).toBeNull();
    });
});
