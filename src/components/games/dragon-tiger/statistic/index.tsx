import { Choices } from "../dragon-tiger-helper";
const StatisticRuleEntries = Object.entries({
    [Choices.dragon]: (countResult: object, total: number) =>
        countResult[Choices.dragon] ? Math.round((countResult[Choices.dragon] * 100) / total) : 0,
    [Choices.tiger]: (countResult: object, total: number) =>
        countResult[Choices.tiger] ? Math.round((countResult[Choices.tiger] * 100) / total) : 0,
    [Choices.tie]: (countResult: object, total: number) =>
        100 -
        ((countResult[Choices.dragon] ? Math.round((countResult[Choices.dragon] * 100) / total) : 0) +
            (countResult[Choices.tiger] ? Math.round((countResult[Choices.tiger] * 100) / total) : 0)),
});

export default StatisticRuleEntries;
