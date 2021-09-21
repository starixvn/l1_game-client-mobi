import { Result } from "./big-small";

export const countRedDot = (result: Result) => Object.values(result).reduce((total, value) => total + value, 0);
export const Choices = { big: "big", small: "small" };

export const StatisticRuleEntries = Object.entries({
    [Choices.big]: (countResult: object, total: number) =>
        countResult[Choices.big] ? Math.round((countResult[Choices.big] * 100) / total) : 0,
    [Choices.small]: (countResult: object, total: number) =>
        100 - (countResult[Choices.big] ? Math.round((countResult[Choices.big] * 100) / total) : 0),
});
