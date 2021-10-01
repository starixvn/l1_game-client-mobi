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
