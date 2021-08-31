import { TFunction } from "next-i18next";
import { KenoMatchRound, Result, SettlementResult } from "./type";

export const defaultResult = {
    blue: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    red: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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


export const KenoMatchConfigs = {
    choices: {
        firstHalf: {
            name: "First Half",
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
        {
            name:"fhRed",
            displayedName: "red"
        },
        {
            name:"total",
            displayedName: "total"
        },
        {
            name:"fhOver",
            displayedName: "over"
        },
        {
            name:"fhUnder",
            displayedName: "under"
        },
        {
            name:"fhEven",
            displayedName: "even"
        },
        {
            name:"fhOdd",
            displayedName: "odd"
        }]}, 
        fullTime:  {
            name: "Full Time",
        config: [{
            name:"ftBlue",
            displayedName: "blue"
        },
        {
            name:"ftRed",
            displayedName: "red"
        },
        {
            name:"total",
            displayedName: "total"
        },
        {
            name:"ftOver",
            displayedName: "over"
        },
        liveFullTime: {
            name: "Live",
        config: [{
            name:"liveFTBlue",
            displayedName: "blue"
        },
        {
            name:"liveFTRed",
            displayedName: "red"
        },
        {
            name:"total",
            displayedName: "total"
        },
        {
            name:"liveFTOver",
            displayedName: "over"
        },
        {
            name:"liveFTUnder",
            displayedName: "under"
        },
        {
            name:"liveFTEven",
            displayedName: "even"
        },
    },
};

export const GetTranslateChoiceMapping = (t: TFunction, gameName = "kenomatch1") => {
    return {
        blue: t(`${gameName}:blue`),
        red: t(`${gameName}:red`),
        over: t(`${gameName}:over`),
        under: t(`${gameName}:under`),
        odd: t(`${gameName}:odd`),
        even: t(`${gameName}:even`),
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

export const countSettlementResultFirstHalf = (roundHistory: KenoMatchRound<Result, SettlementResult>[]) => {
    return roundHistory.reduce((result, { firstHalf }) => {
        if (firstHalf?.settlementResult) {
            for (const [choice, win] of Object.entries(firstHalf.settlementResult)) {
                if (win) {
                    result[choice] = result[choice] ? (result[choice] += 1) : 1;
                }
            }
        }

        return result;
    }, {});
};

export const countSettlementResultFullTime = (roundHistory: KenoMatchRound<Result, SettlementResult>[]) => {
    return roundHistory.reduce((result, { fullTime }) => {
        if (fullTime?.settlementResult) {
            for (const [choice, win] of Object.entries(fullTime.settlementResult)) {
                if (win) {
                    result[choice] = result[choice] ? (result[choice] += 1) : 1;
                }
            }
        }

        return result;
    }, {});
};
