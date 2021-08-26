import { shallow } from "enzyme";
import React from "react";

import ProfilePicture from "..";

describe("Profile Picture", () => {
    it("should render profile picture", () => {
        const wrapper = shallow(<ProfilePicture avatarId={1} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
