import { GameState, ViewMode } from "../../../shared/game-base/type";

const buildGameContext = (gameState = GameState.InRound) => {
    const gameSetting = {
        id: 36,
        gameName: "KenoMatch1",
        socketInfo: {
            namespace: "kenomatch1",
            path: "kenomatch",
        },
        supportMD5: true,
        durations: {
            wholeRound: 71,
            showFullTimeSettlementResult: 66,

            halfTimePlacingBets: 58,
            resetResult: 36,
            halfTimeLockingBet: 36,
            showHalfTimeResult: 31,
            showHalfTimeSettlementResult: 27,

            beforeStartFullTimePlacingBet: 19,
            fullTimePlacingBets: 18,
            fullTimeLockingBet: 5,
            showFullTimeResult: 0,

            showResult: 6,
            halfTimeDuration: 27,
            fullTimeDuration: 18,
            resultAnimation: 8,
            settlementWinning: 6,
        },
    };

    return {
        gameSetting: gameSetting,
        totalBets: {},
        ownBets: {},
        roundId: 1,
        remainingTime: 1,
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
            },
            enableFreeBet: false,
        },
        gameState,
        viewMode: ViewMode.full,
        isShowBlink: false,
        playResultAnimation: true,
    };
};

export default buildGameContext;
