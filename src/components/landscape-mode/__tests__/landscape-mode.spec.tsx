import { shallow } from "enzyme";
import React from "react";

import LandscapeMode from "..";

jest.mock("next-i18next", () => ({
    useTranslation: () => ({
        t: (key: string): string => key,
    }),
}));

describe("landscape mode", () => {
    it("ender correctly", function () {
        const wrapper = shallow(<LandscapeMode />);
        expect(wrapper).toMatchSnapshot();
    });
});
