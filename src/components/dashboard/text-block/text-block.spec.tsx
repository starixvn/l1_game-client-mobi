import { render } from "@testing-library/react";
import React from "react";

import TextBlock from ".";

describe("TextBlock", () => {
    test("renders TextBlock component", async () => {
        // Act
        render(<TextBlock />);

        // Assert
        expect(document.querySelector(".welcome")).toBeTruthy();
    });
});
