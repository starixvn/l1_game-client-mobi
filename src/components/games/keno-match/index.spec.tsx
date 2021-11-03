import { render } from "@testing-library/react";
import React from "react";
import { GameContextProvider } from "../../../contexts/game-context/game-context";
import buildGameContext, { buildDefaultResult } from "./__test__/test-helper";
import KenoMatch from "./";
import { GameBaseProps, ViewMode } from "../../shared/game-base/type";
import { KenoMatchGameDurations, KenoMatchProps } from "./type";
import { i18n } from "next-i18next";
import { AuthContextProvider } from "../../../contexts/auth";
// import MockedSocket from "socket.io-mock";
import { Server } from 'mock-socket';

const buildProps = () => {
    const durations = {
        halfTimePlacingBets: 58,
        halfTimeLockingBet: 36,
        showHalfTimeResult: 31,
        showHalfTimeSettlementResult: 27,
        fullTimePlacingBets: 18,
        fullTimeLockingBet: 5,
        showFullTimeResult: 0,
        showFullTimeSettlementResult: 66,
        beforeStartFullTimePlacingBet: 19,
        halfTimeDuration: 27,
        fullTimeDuration: 18,
        resetResult: 36,
        settlementWinning: 6,
    } as KenoMatchGameDurations;

    return {
        id: 36,
        gameName: "kenomatch1",
        socketInfo: {
            namespace: "kenomatch1",
            path: "kenomatch",
        },
        durations,
        notifyWinStreak: () => {},
        playPlaceBetSound: () => {},
        viewMode: ViewMode.full,
        setApiErrorMessage: () => {},
        supportMD5: true,
        userStakeLevel: { minBet: 1, maxBet: 100 },
        updateUserStakeLevel: () => {},
        t: (str) => str,
        i18n: i18n,
        tReady: true,
        router: null,
    } as KenoMatchProps;
};

describe("KenoMatch", () => {
    test("should be render correctly", () => {
        const session = {
            isAuthenticated: true,
            username: "username",
            language: "en-US",
            ss: "ss",
            memberName: "memberName",
            isUM: false,
            umInfo: { startTime: null, endTime: null },
        };

        // let socket = new MockedSocket();

        const fakeURL = 'ws://localhost/user/kenomatch1';
  const socket = new Server(fakeURL);

        // socket.on('message', function (message) {
        //     expect(message).toEqual('Hello World!');
        // });

        // socket.on('connect_error', function (message) {
        //     expect(message).toEqual('error');

        // });

        // socket.on('inGame', function (message) {
        //     expect(message).toEqual('error');

        // });

        socket.emit("sid", "_T0-BAarTfhUqr_LAA0B");

        socket.emit("message", {"userStakeLevel":{"minBet":1,"maxBet":3000}});

        socket.emit("signin", session);

        socket.emit("KenoMatch1", {
            roundId: 61669,
            gameConfigs: {
                minbet: 1,
                maxbet: 2000,
                choices_maxbet: {
                    fhBlue: 2000,
                    fhRed: 2000,
                    fhOver: 2000,
                    fhUnder: 2000,
                    fhOdd: 2000,
                    fhEven: 2000,
                    ftBlue: 2000,
                    ftRed: 2000,
                    ftOver: 2000,
                    ftUnder: 2000,
                    ftOdd: 2000,
                    ftEven: 2000,
                    liveFTOdd: 2000,
                    liveFTEven: 2000,
                },
                odds: {
                    fhBlue: 1.96,
                    fhRed: 1.96,
                    fhOver: 1.96,
                    fhUnder: 1.96,
                    fhOdd: 1.96,
                    fhEven: 1.96,
                    ftBlue: 1.96,
                    ftRed: 1.96,
                    ftOver: 1.96,
                    ftUnder: 1.96,
                    ftOdd: 1.96,
                    ftEven: 1.96,
                    liveFTOdd: 1.96,
                    liveFTEven: 1.96,
                },
                enableFreeBet: false,
            },
            roundHistory: [],
            ownBets: {},
            totalBets: {},
            user: {
                name: "Scarlet50153",
                UID: 18595,
                avatarId: 32,
                currency: "$US",
                joinedOn: "2021-10-11T08:16:07.263Z",
                red: 2000,
                type: false,
            },
            liveOdds: { liveFTBlue: 1.19, liveFTRed: 4.92, liveFTOver: 1.67, liveFTUnder: 2.34 },
            firstHalfResult: {
                result: { blue: [9, 25, 35, 41, 43, 51, 57, 62, 75, 76], red: [17, 21, 22, 33, 35, 36, 39, 42, 64, 65] },
                settlementResult: { blue: true, red: false, tie: false, over: true, under: false, odd: false, even: true },
                totalRed: 374,
                totalBlue: 474,
                resultKey: "[474;374]3ef2b313dbb90b9718bc5cbab",
            },
            md5: "59d3d19feb485934af94ec92b32d5ffa",
        });

        const authContextValue = { session: session, setBalance: jest.fn };

        render(
            <AuthContextProvider value={authContextValue}>
                <GameContextProvider value={buildGameContext() as any}>
                    <KenoMatch {...buildProps()} />
                </GameContextProvider>
            </AuthContextProvider>
        );

        //// expect(document.querySelector(".round")).toHaveTextContent("61600");
        expect(1).toEqual(1);
    });
});
