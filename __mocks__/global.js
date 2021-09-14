jest.mock("next-i18next", () => ({
    useTranslation: () => {
        return {
            t: (str) => str,
            i18n: {
                changeLanguage: () => new Promise(() => {}),
            },
        };
    },
}));

jest.mock("next/config", () => () => ({
    publicRuntimeConfig: {
        offeredGames: [1],
        gameSettings: {
            1: {
                id: 1,
                gameName: "taixiu",
                socketInfo: {
                    namespace: "taixiu",
                    path: "bigsmall",
                },
                durations: {
                    wholeRound: 62,
                    placingBets: 50,
                    lockingBet: 5,
                    showResult: 8,
                    resultAnimation: 3,
                    beforeStartRound: 0,
                    balancingBet: 3,
                },
            },
        },
    },
}));
