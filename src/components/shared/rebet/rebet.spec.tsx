import { render, mount } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks";
import React from "react";
import "@testing-library/jest-dom";
import Rebet from ".";
import { GameActionsContextProvider } from "../../../contexts/game-actions-context";
import { GameContextProvider } from "../../../contexts/game-context/game-context";

jest.mock("../../../common/local-storage", () => ({
    getLocalStorageItem: () => ({
        1: { big: 200 },
    }),
    localStorageKeys: {},
}));

const gameContext = {
    roundId: 1,
    gameSetting: {
        gameName: "KenoProMax",
    },
};
const gameActionsContext = {
    finishProcessingBet: jest.fn,
    playAcceptedBetAnimation: jest.fn,
    registerMessageHandler: jest.fn,
    unsubscribeMessageHandler: jest.fn,
    placeBet: jest.fn,
};

const RebetProps = {
    gameId: 1,
    getOddsByChoice: jest.fn(),
    onCloseModal: jest.fn(),
};

describe("Rebet tests", () => {
    test("should component render", () => {
        render(
            <GameContextProvider value={gameContext}>
                <GameActionsContextProvider value={gameActionsContext}>
                    <Rebet {...RebetProps}></Rebet>
                </GameActionsContextProvider>
            </GameContextProvider>
        );

        expect(document.querySelector(".container")).toBeTruthy();
        expect(document.querySelector(".header")).toBeTruthy();
        expect(document.querySelector(".bet-list")).toBeTruthy();
        expect(document.querySelector(".action")).toBeTruthy();
    });
});
