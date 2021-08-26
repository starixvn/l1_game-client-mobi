import { shallow } from "enzyme";
import React from "react";

import SplashScreen from "..";

describe("Splash screen", () => {
    ["en", "vi"].forEach((locale) => {
        it("should render splash screen", () => {
            const wrapper = shallow(<SplashScreen locale={locale} />);
            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });
});
