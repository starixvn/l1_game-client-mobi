const Choices = {
    blue: "blue",
    red: "red",
    tie: "tie",
    odd: "odd",
    even: "even",
};

export const StatisticRuleEntriesEvenOdd = Object.entries({
    [Choices.even]: (countResult: object, total: number) =>
        countResult[Choices.even] ? Math.round((countResult[Choices.even] * 100) / total) : 0,

    [Choices.odd]: (countResult: object, total: number) =>
        100 - (countResult[Choices.even] ? Math.round((countResult[Choices.even] * 100) / total) : 0),
});

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
