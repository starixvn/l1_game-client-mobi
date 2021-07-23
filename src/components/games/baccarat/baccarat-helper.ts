import { Cards } from "./baccarat";

export const Choices = {
    banker: "banker",
    player: "player",
    big: "big",
    small: "small",
    tie: "tie",
    bankerPair: "bankerPair",
    playerPair: "playerPair",
};

export const BaccaratConfigs = {
    choices: [
        {
            name: "player",
            style: "player",
        },
        {
            name: "tie",
            style: "tie",
        },
        {
            name: "banker",
            style: "banker",
        },
        {
            name: "big",
            style: "big",
        },
        {
            name: "playerPair",
            style: "player-pair",
        },
        {
            name: "bankerPair",
            style: "bank-pair",
        },
        {
            name: "small",
            style: "small",
        },
    ],
};

export const TotalCardValue = (result: Cards) =>
    Object.values(result)
        .filter((value) => value !== null)
        .reduce((total, value) => total + GetValueCard(value?.card + 1), 0);

export const GetValueCard = (value: number) => {
    return value >= 10 ? 0 : value;
};

export const SetPoint = (point: number) => {
    return point % 10;
};

export const StatisticRuleEntriesBankerPlayer = Object.entries({
    [Choices.player]: (countResult: object, total: number) =>
        countResult[Choices.player] ? Math.round((countResult[Choices.player] * 100) / total) : 0,
    [Choices.banker]: (countResult: object, total: number) =>
        countResult[Choices.banker] ? Math.round((countResult[Choices.banker] * 100) / total) : 0,
    [Choices.tie]: (countResult: object, total: number) =>
        100 -
        (countResult[Choices.banker] ? Math.round((countResult[Choices.banker] * 100) / total) : 0) -
        (countResult[Choices.player] ? Math.round((countResult[Choices.player] * 100) / total) : 0),
});

export const StatisticRuleEntriesBigSmall = Object.entries({
    [Choices.big]: (countResult: object, total: number) =>
        countResult[Choices.big] ? Math.round((countResult[Choices.big] * 100) / total) : 0,

    [Choices.small]: (countResult: object, total: number) =>
        100 - (countResult[Choices.big] ? Math.round((countResult[Choices.big] * 100) / total) : 0),
});

export const StatisticRuleMapping = [StatisticRuleEntriesBankerPlayer, StatisticRuleEntriesBigSmall];
