import { render } from "@testing-library/react";
import React from "react";

import ProfilePicture from ".";

describe("Profile picture", () => {
    it("should render default when invalid avatarId", () => {
        const { getAllByTestId } = render(<ProfilePicture avatarId={0} />);

        expect(getAllByTestId("default-avatar").length).toEqual(1);
    });
});
