import { Result } from "./dragon-tiger";

const getValueCard = (result: Result, name: string) => {
    return result[name].card;
};

export const Choices = { dragon: "dragon", tiger: "tiger", tie: "tie" };

export const checkIsDragon = (result: Result) => {
    return getValueCard(result, Choices.dragon) > getValueCard(result, Choices.tiger);
};

export const checkIsTie = (result: Result) => {
    return getValueCard(result, Choices.dragon) === getValueCard(result, Choices.tiger);
};

export const StatisticRuleEntries = Object.entries({
    [Choices.dragon]: (countResult: object, total: number) =>
        countResult[Choices.dragon] ? Math.round((countResult[Choices.dragon] * 100) / total) : 0,
    [Choices.tiger]: (countResult: object, total: number) =>
        countResult[Choices.tiger] ? Math.round((countResult[Choices.tiger] * 100) / total) : 0,
    [Choices.tie]: (countResult: object, total: number) =>
        100 -
        ((countResult[Choices.dragon] ? Math.round((countResult[Choices.dragon] * 100) / total) : 0) +
            (countResult[Choices.tiger] ? Math.round((countResult[Choices.tiger] * 100) / total) : 0)),
});
