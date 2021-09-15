import { render } from "@testing-library/react";
import React from "react";
import { KenoMatchGameStateEnum } from "../type";
import KenoMatchBetOption from "./";

describe("KenoMatchBetOption", () => {
    test("should render correctly", () => {
        const betOptionProps = {
            choice: "fhBlue",
            odd: 1.96,
            isDisplayOdd: true,
            isHighlight: true,
            gameState: KenoMatchGameStateEnum.HalfTimePlacingBet as number,
            isShowWinningEffect: true,
            bettypeName: "FirstHalfTeamBlueTeamRed",
        };

        render(
            <KenoMatchBetOption {...betOptionProps}>
                <div className="blue">blue</div>
            </KenoMatchBetOption>
        );

        expect(document.querySelector(".container")).toBeTruthy();
        expect(document.querySelector(".bet-option")).toBeTruthy();
        expect(document.querySelector(".winning-effect")).toBeTruthy();
        expect(document.querySelector(".total-bet")).toBeTruthy();
        expect(document.querySelector(".own-bet")).toBeTruthy();
        expect(document.querySelector(".d-inline-block")).toBeTruthy();
        expect(document.querySelector(".blue")).toBeTruthy();
    });

    test.each`
        gameState                                              | expectedResult
        ${KenoMatchGameStateEnum.ShowFullTimeSettlementResult} | ${1}
        ${KenoMatchGameStateEnum.ShowHalfTimeSettlementResult} | ${1}
        ${KenoMatchGameStateEnum.FullTimePlacingBet}           | ${1}
        ${KenoMatchGameStateEnum.HalfTimePlacingBet}           | ${1}
        ${KenoMatchGameStateEnum.HalfTimeLockingBet}           | ${0}
        ${KenoMatchGameStateEnum.FullTimeLockingBet}           | ${0}
    `("should render active classname correctly", ({ gameState, expectedResult }) => {
        const betOptionProps = {
            choice: "fhBlue",
            odd: 1.96,
            isDisplayOdd: true,
            isHighlight: true,
            gameState,
            isShowWinningEffect: true,
            bettypeName: "FirstHalfTeamBlueTeamRed",
        };

        render(
            <KenoMatchBetOption {...betOptionProps}>
                <div className="blue">blue</div>
            </KenoMatchBetOption>
        );

        expect(document.getElementsByClassName("highlight-winning").length).toEqual(expectedResult);
    });
});
