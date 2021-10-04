import { render } from "@testing-library/react";
import React from "react";
import { GameContextProvider } from "../../../../../contexts/game-context/game-context";
import AnimationResult from "./";
import buildGameContext from "../../__test__/test-helper";

const buildDefaultResult = () => {
    let index = 10;
    const emptyResult = [];
    while (index > 0) {
        emptyResult.push(index);
        index--;
    }

    return emptyResult;
};

const buildAnimationResultProps = (isFirstHalf = true, isShowCollapse = false, playResultAnimation = true) => {
    const blueTeam = buildDefaultResult();
    const redTeam = buildDefaultResult();
    const fakeResult = {
        blue: blueTeam,
        red: redTeam,
    };

    return {
        halfTimeResultInline: fakeResult,
        fullTimeResultInline: fakeResult,
        isFirstHalf,
        playResultAnimation,
        isShowCollapse,
    };
};

describe("AnimationResult", () => {
    test("should be render correctly", () => {
        render(
            <GameContextProvider value={buildGameContext() as any}>
                <AnimationResult {...buildAnimationResultProps()} />
            </GameContextProvider>
        );

        expect(document.querySelector(".animation-result")).toBeTruthy();
        expect(document.querySelector(".result")).toBeTruthy();
        expect(document.querySelector(".open-result")).toBeTruthy();
        expect(document.querySelector(".header")).toBeTruthy();
        expect(document.querySelector(".main-content")).toBeTruthy();
    });

    test.each`
        isFirstHalf | expectedHeaderText
        ${true}     | ${"firstHalf"}
        ${false}    | ${"fullTime"}
    `("always render header text correctly", ({ isFirstHalf, expectedHeaderText }) => {
        render(
            <GameContextProvider value={buildGameContext() as any}>
                <AnimationResult {...buildAnimationResultProps(isFirstHalf, false, true)} />
            </GameContextProvider>
        );

        expect(document.querySelector(".header")).toHaveTextContent(expectedHeaderText);
    });
});
