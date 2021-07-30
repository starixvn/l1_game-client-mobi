import { shallow } from "enzyme";
import React from "react";

import SplashScreen from "..";

describe("SplashScreen should render my component", () => {
    ["en", "vi"].forEach((locale) => {
        it("should render my component", () => {
            const wrapper = shallow(<SplashScreen locale={locale} />);
            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });
});
