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
                wholeRound: 50,
                placingBets: 45,
                lockingBet: 5,
                showResult: 3,
                beforeStartRound: 1,
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
                wholeRound: 39,
                placingBets: 30,
                lockingBet: 5,
                showResult: 3,
                beforeStartRound: 2,
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
                wholeRound: 39,
                placingBets: 30,
                lockingBet: 5,
                showResult: 4,
                beforeStartRound: 1,
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
                wholeRound: 36,
                placingBets: 30,
                lockingBet: 5,
                showResult: 4,
                beforeStartRound: 1,
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
                wholeRound: 39,
                placingBets: 30,
                lockingBet: 5,
                showResult: 3,
                beforeStartRound: 2,
            },
        },
    },
};
