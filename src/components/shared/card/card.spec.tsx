import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import Card, { convertRank, convertCardRankToIndex, getClassFollowCondition } from ".";
import { ViewMode } from "../game-base/type";

describe("convert rank card by number", () => {
    test("should render correct number", () => {
        expect(convertRank(1)).toBe("2");
    });

    test("should render correct string", () => {
        expect(convertRank(10)).toBe("J");
    });
});

describe("convert rank card to number", () => {
    test("should render number", () => {
        expect(convertCardRankToIndex("J")).toBe(11);
    });
});

describe("test render component card", () => {
    test("should render correct class name", () => {
        expect(getClassFollowCondition({ viewMode: ViewMode.collapse, isSmall: false })).toBe("collapse");
    });

    test("should render correct card", () => {
        const cardResult = { card: 8, type: 3 };
        const linkCard = "/static/images/cards/9-spade.svg#v1";
        render(<Card result={cardResult} isSmall={false} viewMode={ViewMode.full} />);
        expect(screen.getByRole("img")).toHaveAttribute("src", linkCard);
    });
});
