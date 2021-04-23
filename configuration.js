module.exports = {
    ssl: process.env.SSL === "true",
    proxyUrl: process.env.PROXY_URL,
    offeredGames: process.env.OFFERED_GAMES.split(",").map((id) => parseInt(id)),
    gameConfigs: {
        1: {
            id: 1,
            gameName: "taixiu",
            socketInfo: {
                namespace: "taixiu",
                path: "bigsmall",
            },
            durations: {
                wholeRound: 61,
                placingBets: 50,
                lockingBet: 5,
                showResult: 5,
                highlightBeforeWaiting: 2,
                beforeStartRound: 0,
            },
        },
        2: {
            id: 2,
            gameName: "XocXoc",
            socketInfo: {
                namespace: "xocxoc",
                path: "sedie",
            },
            durations: {
                wholeRound: 40,
                placingBets: 30,
                lockingBet: 5,
                showResult: 2,
                highlightBeforeWaiting: 1.5,
                beforeStartRound: 1,
            },
        },
        3: {
            id: 3,
            gameName: "BauCua",
            socketInfo: {
                namespace: "baucua",
                path: "fishprawncrab",
            },
            durations: {
                wholeRound: 40,
                placingBets: 30,
                lockingBet: 5,
                showResult: 4,
                highlightBeforeWaiting: 2,
                beforeStartRound: 0,
            },
        },
        4: {
            id: 4,
            gameName: "TXTurbo",
            socketInfo: {
                namespace: "txturbo",
                path: "turbobigsmall",
            },
            durations: {
                wholeRound: 37,
                placingBets: 30,
                lockingBet: 5,
                showResult: 5,
                highlightBeforeWaiting: 2,
                beforeStartRound: 0,
            },
        },
        7: {
            id: 7,
            gameName: "DragonTiger",
            socketInfo: {
                namespace: "dragontiger",
                path: "dragontiger",
            },
            durations: {
                wholeRound: 37,
                placingBets: 30,
                lockingBet: 5,
                showResult: 4,
                highlightBeforeWaiting: 2,
                beforeStartRound: 2,
            },
        },
        22: {
            id: 22,
            gameName: "VipSeDie",
            socketInfo: {
                namespace: "vipsedie",
                path: "vsedie",
            },
            durations: {
                wholeRound: 40,
                placingBets: 30,
                lockingBet: 5,
                showResult: 2,
                highlightBeforeWaiting: 1.5,
                beforeStartRound: 2,
            },
        },
    },
};
