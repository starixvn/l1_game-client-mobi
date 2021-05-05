import { Choices } from "../big-small-helper";

const StatisticRuleEntries = Object.entries({
    [Choices.big]: (countResult: object, total: number) => Math.round((countResult[Choices.big] * 100) / total),
    [Choices.small]: (countResult: object, total: number) => 100 - Math.round((countResult[Choices.big] * 100) / total),
});

export default StatisticRuleEntries;
