import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import Card, { convertRank, convertCardRankToIndex, getClassFollowCondition } from ".";
import { ViewMode } from "../game-base/type";

describe("convert rank card", () => {
    test.each`
        rank  | expectedResult
        ${10} | ${"J"}
        ${11} | ${"Q"}
        ${12} | ${"K"}
        ${0}  | ${"A"}
        ${1}  | ${"2"}
    `("should convert correct rank", ({ rank, expectedResult }) => {
        expect(convertRank(rank)).toBe(expectedResult);
    });
});

describe("convert rank card to number", () => {
    test.each`
        rank   | expectedResult
        ${"J"} | ${11}
        ${"Q"} | ${12}
        ${"K"} | ${13}
        ${"A"} | ${1}
        ${1}   | ${1}
    `("should convert correct number", ({ rank, expectedResult }) => {
        expect(convertCardRankToIndex(rank)).toBe(expectedResult);
    });
});

describe("test render component card", () => {
    // arrange
    const cardResult = { card: 9, type: 3 };
    test("should render correct class collapse", () => {
        expect(getClassFollowCondition({ viewMode: ViewMode.collapse, isSmall: false })).toBe("collapse");
    });

    test("should render correct class small", () => {
        expect(getClassFollowCondition({ viewMode: ViewMode.full, isSmall: true })).toBe("small");
    });

    test("should render correct default card", () => {
        // arrange
        const linkCardDefault = "/static/images/cards/10-spade.svg#v1";

        // act
        render(<Card result={cardResult} isSmall={false} viewMode={ViewMode.full} />);

        // assert
        expect(screen.getByRole("img")).toHaveAttribute("src", linkCardDefault);
    });

    test("should render correct small card", () => {
        // arrange
        const linkCardMini = "/static/images/cards/mini/mini-spade.svg";

        // act
        render(<Card result={cardResult} isSmall={true} viewMode={ViewMode.full} />);

        // assert
        expect(screen.getByRole("img")).toHaveAttribute("src", linkCardMini);
    });

    test("render class custom when card 10 appear", () => {
        render(<Card result={cardResult} isSmall={true} viewMode={ViewMode.full} />);

        // assert
        expect(document.getElementsByClassName("card-number-10").length).toBeGreaterThan(0);
    });
});
