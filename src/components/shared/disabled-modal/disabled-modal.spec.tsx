import "@testing-library/jest-dom";

import { render } from "@testing-library/react";
import React from "react";

import DisabledModal from ".";
import { ViewMode } from "../game-base/type";

test("should render correctly", () => {
    // arrange
    const disableMessage = "Game was disabled";

    // act
    const { getByTestId } = render(<DisabledModal disabledMessage={disableMessage} viewMode={ViewMode.full} />);

    // assert
    expect(getByTestId("disable-message")).toHaveTextContent(disableMessage);
});
