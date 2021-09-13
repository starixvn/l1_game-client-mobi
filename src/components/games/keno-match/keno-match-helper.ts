import { TFunction } from "next-i18next";

const validateResetValue = (value: number) => (value !== resetValue ? value : 0);
export const calculateTotalPoint = (results: number[]) => results.reduce((a, b) => validateResetValue(a) + validateResetValue(b), 0);

export const resetValue = -1;
const buildDefaultResult = () => {
    let index = 10,
        emptyResult = [];
    while (index > 0) {
        emptyResult.push(resetValue);
        index--;
    }

    return emptyResult;
};

export const defaultResult = {
    blue: buildDefaultResult(),
    red: buildDefaultResult(),
};

export const choicesMapper = {
    fhBlue: "blue",
    fhRed: "red",
    fhOver: "over",
    fhUnder: "under",
    fhOdd: "odd",
    fhEven: "even",
    ftBlue: "blue",
    ftRed: "red",
    ftOver: "over",
    ftUnder: "under",
    ftOdd: "odd",
    ftEven: "even",
    liveFTBlue: "blue",
    liveFTRed: "red",
    liveFTOver: "over",
    liveFTUnder: "under",
    liveFTOdd: "odd",
    liveFTEven: "even",
};

export const Choices = {
    blue: "blue",
    red: "red",
    tie: "tie",
    over: "over",
    under: "under",
    odd: "odd",
    even: "even",
};

export const FakeSettlementResult = {
    blue: false,
    red: false,
    tie: true,
    over: true,
    under: false,
    odd: true,
    even: false,
};

export const KenoMatchConfigs = {
    choices: {
        firstHalf: {
            name: "firstHalf",
            config: [
                {
                    name: "fhBlue",
                    displayedName: "blue",
                },
                {
                    name: "fhRed",
                    displayedName: "red",
                },
                {
                    name: "total",
                    displayedName: "total",
                },
                {
                    name: "fhOver",
                    displayedName: "over",
                },
                {
                    name: "fhUnder",
                    displayedName: "under",
                },
                {
                    name: "fhEven",
                    displayedName: "even",
                },
                {
                    name: "fhOdd",
                    displayedName: "odd",
                },
            ],
        },
        fullTime: {
            name: "fullTime",
            config: [
                {
                    name: "ftBlue",
                    displayedName: "blue",
                },
                {
                    name: "ftRed",
                    displayedName: "red",
                },
                {
                    name: "total",
                    displayedName: "total",
                },
                {
                    name: "ftOver",
                    displayedName: "over",
                },
                {
                    name: "ftUnder",
                    displayedName: "under",
                },
                {
                    name: "ftEven",
                    displayedName: "even",
                },
                {
                    name: "ftOdd",
                    displayedName: "odd",
                },
            ],
        },
        liveFullTime: {
            name: "live",
            config: [
                {
                    name: "liveFTBlue",
                    displayedName: "blue",
                },
                {
                    name: "liveFTRed",
                    displayedName: "red",
                },
                {
                    name: "total",
                    displayedName: "total",
                },
                {
                    name: "liveFTOver",
                    displayedName: "over",
                },
                {
                    name: "liveFTUnder",
                    displayedName: "under",
                },
                {
                    name: "liveFTEven",
                    displayedName: "even",
                },
                {
                    name: "liveFTOdd",
                    displayedName: "odd",
                },
            ],
        },
    },
};

export const GetTranslateMapping = (t: TFunction, gameName = "kenomatch1") => {
    return {
        firstHalf: t(`${gameName}:firstHalf`),
        fullTime: t(`${gameName}:fullTime`),
        blue: t(`${gameName}:blue`),
        red: t(`${gameName}:red`),
        over: t(`${gameName}:over`),
        under: t(`${gameName}:under`),
        odd: t(`${gameName}:odd`),
        even: t(`${gameName}:even`),
        live: t(`${gameName}:live`),
        sum: t(`${gameName}:sum`),
        total: t(`${gameName}:total`),
    };
};

export const StatisticRuleEntriesBlueRed = Object.entries({
    [Choices.blue]: (countResult: object, total: number) =>
        countResult[Choices.blue] ? Math.round((countResult[Choices.blue] * 100) / total) : 0,
    [Choices.tie]: (countResult: object, total: number) =>
        countResult[Choices.tie] ? Math.round((countResult[Choices.tie] * 100) / total) : 0,
    [Choices.red]: (countResult: object, total: number) =>
        100 -
        (countResult[Choices.blue] ? Math.round((countResult[Choices.blue] * 100) / total) : 0) -
        (countResult[Choices.tie] ? Math.round((countResult[Choices.tie] * 100) / total) : 0),
});

export const StatisticRuleEntriesOverUnder = Object.entries({
    [Choices.over]: (countResult: object, total: number) =>
        countResult[Choices.over] ? Math.round((countResult[Choices.over] * 100) / total) : 0,

    [Choices.under]: (countResult: object, total: number) =>
        100 - (countResult[Choices.over] ? Math.round((countResult[Choices.over] * 100) / total) : 0),
});

export const StatisticRuleEntriesEvenOdd = Object.entries({
    [Choices.even]: (countResult: object, total: number) =>
        countResult[Choices.even] ? Math.round((countResult[Choices.even] * 100) / total) : 0,

    [Choices.odd]: (countResult: object, total: number) =>
        100 - (countResult[Choices.even] ? Math.round((countResult[Choices.even] * 100) / total) : 0),
});

export const StatisticRuleMapping = [
    StatisticRuleEntriesBlueRed,
    StatisticRuleEntriesOverUnder,
    StatisticRuleEntriesEvenOdd,
    StatisticRuleEntriesBlueRed,
    StatisticRuleEntriesOverUnder,
    StatisticRuleEntriesEvenOdd,
];
