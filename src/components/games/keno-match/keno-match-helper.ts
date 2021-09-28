import { StatisticRuleEntriesEvenOdd, StatisticRuleEntriesBlueRed } from "../../keno/keno.helper";

export const resetValue = 0;
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
                    bettypeName: "FirstHalfTeamBlueTeamRed",
                },
                {
                    name: "fhRed",
                    displayedName: "red",
                    bettypeName: "FirstHalfTeamBlueTeamRed",
                },
                {
                    name: "total",
                    displayedName: "total",
                },
                {
                    name: "fhOver",
                    displayedName: "over",
                    bettypeName: "FirstHalfOverUnder",
                },
                {
                    name: "fhUnder",
                    displayedName: "under",
                    bettypeName: "FirstHalfOverUnder",
                },
                {
                    name: "fhEven",
                    displayedName: "even",
                    bettypeName: "FirstHalfEvenOdd",
                },
                {
                    name: "fhOdd",
                    displayedName: "odd",
                    bettypeName: "FirstHalfEvenOdd",
                },
            ],
        },
        fullTime: {
            name: "fullTime",
            config: [
                {
                    name: "ftBlue",
                    displayedName: "blue",
                    bettypeName: "FullTimeTeamBlueTeamRed",
                },
                {
                    name: "ftRed",
                    displayedName: "red",
                    bettypeName: "FullTimeTeamBlueTeamRed",
                },
                {
                    name: "total",
                    displayedName: "total",
                },
                {
                    name: "ftOver",
                    displayedName: "over",
                    bettypeName: "FullTimeOverUnderRed",
                },
                {
                    name: "ftUnder",
                    displayedName: "under",
                    bettypeName: "FullTimeOverUnderRed",
                },
                {
                    name: "ftEven",
                    displayedName: "even",
                    bettypeName: "FullTimeEvenOdd",
                },
                {
                    name: "ftOdd",
                    displayedName: "odd",
                    bettypeName: "FullTimeEvenOdd",
                },
            ],
        },
        liveFullTime: {
            name: "fullTime",
            config: [
                {
                    name: "liveFTBlue",
                    displayedName: "blue",
                    bettypeName: "FullTimeTeamBlueTeamRedLive",
                },
                {
                    name: "liveFTRed",
                    displayedName: "red",
                    bettypeName: "FullTimeTeamBlueTeamRedLive",
                },
                {
                    name: "total",
                    displayedName: "total",
                },
                {
                    name: "liveFTOver",
                    displayedName: "over",
                    bettypeName: "FullTimeOverUnderLive",
                },
                {
                    name: "liveFTUnder",
                    displayedName: "under",
                    bettypeName: "FullTimeOverUnderLive",
                },
                {
                    name: "liveFTEven",
                    displayedName: "even",
                    bettypeName: "FullTimeEvenOddLive",
                },
                {
                    name: "liveFTOdd",
                    displayedName: "odd",
                    bettypeName: "FullTimeEvenOddLive",
                },
            ],
        },
    },
};
export const StatisticRuleEntriesOverUnder = Object.entries({
    [Choices.over]: (countResult: object, total: number) =>
        countResult[Choices.over] ? Math.round((countResult[Choices.over] * 100) / total) : 0,

    [Choices.under]: (countResult: object, total: number) =>
        100 - (countResult[Choices.over] ? Math.round((countResult[Choices.over] * 100) / total) : 0),
});

export const StatisticRuleMapping = [
    StatisticRuleEntriesBlueRed,
    StatisticRuleEntriesOverUnder,
    StatisticRuleEntriesEvenOdd,
    StatisticRuleEntriesBlueRed,
    StatisticRuleEntriesOverUnder,
    StatisticRuleEntriesEvenOdd,
];

export const buildHalfMatchProps = (isFirstHalf: boolean) => {
    return {
        className: isFirstHalf ? "half-time" : "full-time",
        headerText: isFirstHalf ? "firstHalf" : "fullTime",
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
