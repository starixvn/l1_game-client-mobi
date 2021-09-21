import { TFunction } from "next-i18next";

const validateResetValue = (value: number) => (value !== resetValue ? value : 0);
export const calculateTotalPoint = (results: number[]) => results.reduce((a, b) => validateResetValue(a) + validateResetValue(b), 0);

export const resetValue = -1;
const buildDefaultResult = () => {
    let index = 10;
    const emptyResult = [];
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
                    bettypeName:"FirstHalfTeamBlueTeamRed"
                },
                {
                    name: "fhRed",
                    displayedName: "red",
                    bettypeName:"FirstHalfTeamBlueTeamRed"
                },
                {
                    name: "total",
                    displayedName: "total",
                },
                {
                    name: "fhOver",
                    displayedName: "over",
                    bettypeName:"FirstHalfOverUnder"
                },
                {
                    name: "fhUnder",
                    displayedName: "under",
                    bettypeName:"FirstHalfOverUnder"
                },
                {
                    name: "fhEven",
                    displayedName: "even",
                    bettypeName:"FirstHalfEvenOdd"
                },
                {
                    name: "fhOdd",
                    displayedName: "odd",
                    bettypeName:"FirstHalfEvenOdd"
                },
            ],
        },
        fullTime: {
            name: "fullTime",
            config: [
                {
                    name: "ftBlue",
                    displayedName: "blue",
                    bettypeName:"FullTimeTeamBlueTeamRed"
                },
                {
                    name: "ftRed",
                    displayedName: "red",
                    bettypeName:"FullTimeTeamBlueTeamRed"
                },
                {
                    name: "total",
                    displayedName: "total"
                },
                {
                    name: "ftOver",
                    displayedName: "over",
                    bettypeName:"FullTimeOverUnderRed"
                },
                {
                    name: "ftUnder",
                    displayedName: "under",
                    bettypeName:"FullTimeOverUnderRed"
                },
                {
                    name: "ftEven",
                    displayedName: "even",
                    bettypeName:"FullTimeEvenOdd"
                },
                {
                    name: "ftOdd",
                    displayedName: "odd",
                    bettypeName:"FullTimeEvenOdd"
                },
            ],
        },
        liveFullTime: {
            name: "live",
            config: [
                {
                    name: "liveFTBlue",
                    displayedName: "blue",
                    bettypeName:"FullTimeTeamBlueTeamRedLive"
                },
                {
                    name: "liveFTRed",
                    displayedName: "red",
                    bettypeName:"FullTimeTeamBlueTeamRedLive"
                },
                {
                    name: "total",
                    displayedName: "total",
                },
                {
                    name: "liveFTOver",
                    displayedName: "over",
                    bettypeName:"FullTimeOverUnderLive"
                },
                {
                    name: "liveFTUnder",
                    displayedName: "under",
                    bettypeName:"FullTimeOverUnderLive"
                },
                {
                    name: "liveFTEven",
                    displayedName: "even",
                    bettypeName:"FullTimeEvenOddLive"
                },
                {
                    name: "liveFTOdd",
                    displayedName: "odd",
                    bettypeName:"FullTimeEvenOddLive"
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

export const buildHalfMatchProps = (isActiveLiveFullTime: boolean) => {
    return {
        className: isActiveLiveFullTime ? "full-time" : "half-time",
        headerText: isActiveLiveFullTime ? "fullTime" : "firstHalf",
    };
};


export const ChoiceForTabActive = [
    {
        choice: ["red", "blue", "tie"],
    },
    {
        choice: ["over", "under"],
    },
    {
        choice: ["even", "odd"],
    },
    {
        choice: ["red", "blue", "tie"],
    },
    {
        choice: ["over", "under"],
    },
    {
        choice: ["even", "odd"],
    },
];

