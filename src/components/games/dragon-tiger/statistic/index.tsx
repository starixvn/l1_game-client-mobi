import { Choices } from "../dragon-tiger-helper";
const StatisticRuleEntries = Object.entries({
    [Choices.dragon]: (countResult: object, total: number) => Math.round((countResult[Choices.dragon] * 100) / total),
    [Choices.tiger]: (countResult: object, total: number) => Math.round((countResult[Choices.tiger] * 100) / total),
    [Choices.tie]: (countResult: object, total: number) =>
        100 - Math.round((countResult[Choices.dragon] * 100) / total) - Math.round((countResult[Choices.tiger] * 100) / total),
});

export default StatisticRuleEntries;
