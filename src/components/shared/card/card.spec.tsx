import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import Card, { convertRank, convertCardRankToIndex, getClassFollowCondition } from ".";
import { ViewMode } from "../game-base/type";

describe("convert rank card by number", () => {
    test("should render correct number", () => {
        expect(convertRank(1)).toBe("2");
    });

    test("return string if value exist", () => {
        // arrange
        const resource = {
            11: "J",
            12: "Q",
            13: "K",
            1: "A",
        };

        // act
        Object.keys(resource).forEach((number) => {
            // assert
            expect(convertRank(+number - 1)).toBe(resource[number]);
        });
    });
});

describe("convert rank card to number", () => {
    test("should return number if value exist", () => {
        // arrange
        const resource = {
            J: 11,
            Q: 12,
            K: 13,
            A: 1,
        };

        // act
        Object.keys(resource).forEach((text) => {
            // assert
            expect(convertCardRankToIndex(text)).toBe(resource[text]);
        });
    });

    test("should render number if value not exist", () => {
        expect(convertCardRankToIndex("11")).toBe(11);
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
