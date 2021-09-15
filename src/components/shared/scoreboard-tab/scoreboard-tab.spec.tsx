import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import ScoreboardTab from ".";

describe("test scoreboard tab", () => {
    test("should render once class active", () => {
        const resourceTab = {
            redBlack: { tabName: "Red/Back", tabWinningStreak: 1 },
            suits: { tabName: "suits", tabWinningStreak: 0 },
        };
        const { container } = render(<ScoreboardTab tabsValue={resourceTab} activeScoreboardTab={1} />);
        expect(container.getElementsByClassName("tabs-active").length).toBe(1);
    });
});
