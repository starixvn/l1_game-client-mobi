import React from "react";
import { mount } from "enzyme";

describe("Chip slider test", () => {
    const wrapper = mount(<p>Hello Jest!</p>);
    expect(wrapper.text()).toMatch("Hello Jest!");
});
