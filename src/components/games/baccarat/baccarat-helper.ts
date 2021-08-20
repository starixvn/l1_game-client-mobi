import { TFunction } from "next-i18next";
import { Result, CardOrder } from "./baccarat";

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

export const StatisticRuleEntriesBankerPlayer = Object.entries({
    [Choices.player]: (countResult: object, total: number) =>
        countResult[Choices.player] ? Math.round((countResult[Choices.player] * 100) / total) : 0,
    [Choices.tie]: (countResult: object, total: number) =>
        countResult[Choices.tie] ? Math.round((countResult[Choices.tie] * 100) / total) : 0,
    [Choices.banker]: (countResult: object, total: number) =>
        100 -
        (countResult[Choices.player] ? Math.round((countResult[Choices.player] * 100) / total) : 0) -
        (countResult[Choices.tie] ? Math.round((countResult[Choices.tie] * 100) / total) : 0),
});

export const StatisticRuleEntriesBigSmall = Object.entries({
    [Choices.big]: (countResult: object, total: number) =>
        countResult[Choices.big] ? Math.round((countResult[Choices.big] * 100) / total) : 0,

    [Choices.small]: (countResult: object, total: number) =>
        100 - (countResult[Choices.big] ? Math.round((countResult[Choices.big] * 100) / total) : 0),
});

export const StatisticRuleMapping = [StatisticRuleEntriesBankerPlayer, StatisticRuleEntriesBigSmall];

export const GetPlayerCardsResult = (result: Result): CardOrder[] => {
    return [
        { value: result.player.card1, order: 1 },
        { value: result.player.card2, order: 2 },
        { value: result.player?.card3, order: 5 },
    ].filter((c) => c.value);
};

export const GetBankerCardsResult = (result: Result): CardOrder[] => {
    const bankerCards = [
        { value: result.banker.card1, order: 3 },
        { value: result.banker.card2, order: 4 },
        { value: result.banker?.card3, order: 6 },
    ];

    if (!result.player.card3) {
        bankerCards[2].order = 5;
    }

    return bankerCards.filter((c) => c.value);
};

export const GetTranslateChoiceMapping = (t: TFunction, gameName = "baccarat") => {
    return {
        player: t(`${gameName}:player`),
        banker: t(`${gameName}:banker`),
        tie: t(`${gameName}:tie`),
        playerPair: t(`${gameName}:playerPair`),
        bankerPair: t(`${gameName}:bankerPair`),
        big: t(`${gameName}:big`),
        small: t(`${gameName}:small`),
    };
};
