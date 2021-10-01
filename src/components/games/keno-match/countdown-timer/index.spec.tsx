import { render } from "@testing-library/react";
import React from "react";
import { GameContextProvider } from "../../../../contexts/game-context/game-context";
import { GameState } from "../../../shared/game-base/type";
import KenoCountdownTimer, { GameStatus, Timer, GameStatusAndTimer, GameStatusAndShowResult } from "./";
import buildGameContext from "../__test__/test-helper";

test("GameStatus should be render correctly", () => {
    const content = <div className={"start-betting"}>start Betting</div>;
    render(<GameStatus> {content} </GameStatus>);

    expect(document.querySelector(".game-status")).toBeTruthy();
    expect(document.querySelector(".start-betting")).toBeTruthy();
    expect(document.querySelector(".start-betting").innerHTML).toEqual("start Betting");
});

const buildTimerProps = (lockingBet = true) => {
    return {
        duration: 27,
        initialRemainingTime: 15,
        lockingBet,
    };
};

describe("Timer", () => {
    test("should be render correctly", () => {
        render(<Timer {...buildTimerProps()} />);
        expect(document.querySelector(".timer")).toBeTruthy();
    });

    test.each`
        lockingBet | expectedColor
        ${true}    | ${"#FF0505"}
        ${false}   | ${"#19A32F"}
    `("always render color correctly", ({ lockingBet, expectedColor }) => {
        render(<Timer {...buildTimerProps(lockingBet)} />);
        expect(document.querySelectorAll('div[aria-hidden="true"]')[0]).toHaveStyle(`color: ${expectedColor}`);
    });
});

const buildGameStatusWithTimerProps = (isStarBetting = true) => {
    return {
        duration: 27,
        initialRemainingTime: 15,
        lockingBet: false,
        isStarBetting,
    };
};

describe("GameStatusAndTimer", () => {
    test.each`
        isStarBetting | expectedClassName   | expectedText
        ${true}       | ${".start-betting"} | ${"startBetting"}
        ${false}      | ${".no-more-bets"}  | ${"noMoreBets"}
    `("always render css and content correctly", ({ isStarBetting, expectedClassName, expectedText }) => {
        render(<GameStatusAndTimer {...buildGameStatusWithTimerProps(isStarBetting)} />);
        expect(document.querySelector(expectedClassName)).toBeTruthy();
        expect(document.querySelector(expectedClassName)).toHaveTextContent(expectedText);
        expect(document.querySelector(".game-status")).toBeTruthy();
    });
});

test("GameStatusAndShowResult should be render correctly", () => {
    render(<GameStatusAndShowResult />);
    expect(document.querySelector(".loader-show-result")).toBeTruthy();
    expect(document.querySelector(".open-result")).toBeTruthy();
    expect(document.querySelector(".open-result")).toHaveTextContent("openResult");
});

describe("KenoCountdownTimer", () => {
    test.each`
        gameState                     | expectedRenderTimer | expectedRenderOpenResult | expectedRenderLoader
        ${GameState.InRound}          | ${1}                | ${0}                     | ${0}
        ${GameState.LockingBet}       | ${1}                | ${0}                     | ${0}
        ${GameState.DisplayResult}    | ${0}                | ${1}                     | ${0}
        ${GameState.None}             | ${0}                | ${0}                     | ${1}
        ${GameState.BeforeStartRound} | ${0}                | ${0}                     | ${0}
    `("always render timer", ({ gameState, expectedRenderTimer, expectedRenderOpenResult, expectedRenderLoader }) => {
        render(
            <GameContextProvider value={buildGameContext(gameState) as any}>
                <KenoCountdownTimer isFistHalf={true} />
            </GameContextProvider>
        );
        expect(document.getElementsByClassName("timer").length).toEqual(expectedRenderTimer);
        expect(document.getElementsByClassName("open-result").length).toEqual(expectedRenderOpenResult);
        expect(document.getElementsByClassName("loader").length).toEqual(expectedRenderLoader);
    });
});
