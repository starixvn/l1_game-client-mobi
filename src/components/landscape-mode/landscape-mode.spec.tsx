import { render } from "@testing-library/react";
import React from "react";

import LandscapeMode from ".";

// import '@testing-library/jest-dom';
jest.mock("next-i18next", () => ({
    useTranslation: () => ({
        t: (key: string): string => key,
    }),
}));

test("landscape mode component should render correctly", () => {
    const { getByTestId } = render(<LandscapeMode />);
    expect(getByTestId("landscape-mode-component")).toHaveClass("landscape-mode");
});
