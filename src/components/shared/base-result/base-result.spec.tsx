import { render } from "@testing-library/react";
import React from "react";

import BaseResult from ".";

describe("BaseResult", () => {
    test("renders BaseResult component", () => {
        const { getByText } = render(<BaseResult showResultTimeInSecond={3}>{"children"}</BaseResult>);

        expect(getByText("children")).toBeInTheDocument();
    });
});
