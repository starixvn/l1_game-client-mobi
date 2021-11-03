import { render } from "@testing-library/react";
import React from "react";

import SectionResultContainer from ".";

describe("SectionResultContainer", () => {
    test("should render SectionResultContainer component", () => {
        // Arrange
        const gameName = "keno";
        // Act
        const { getByText } = render(<SectionResultContainer gameName={gameName}>{"children"}</SectionResultContainer>);

        // Assert
        expect(getByText("children")).toBeInTheDocument();
        expect(document.querySelector(".section-result-container")).toBeTruthy();
    });
});
