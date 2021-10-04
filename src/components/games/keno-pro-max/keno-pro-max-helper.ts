import { TFunction } from "next-i18next";
export const Choices = {
    big: "big",
    small: "small",
    even: "even",
    odd: "odd",
    gold: "gold",
    wood: "wood",
    water: "water",
    fire: "fire",
    earth: "earth",
};

const StatisticRuleEntriesBigSmall = Object.entries({
    [Choices.big]: (countResult: object, total: number) =>
        countResult[Choices.big] ? Math.round((countResult[Choices.big] * 100) / total) : 0,

    [Choices.small]: (countResult: object, total: number) =>
        100 - (countResult[Choices.big] ? Math.round((countResult[Choices.big] * 100) / total) : 0),
});

const StatisticRuleEntriesOddEven = Object.entries({
    [Choices.even]: (countResult: object, total: number) =>
        countResult[Choices.even] ? Math.round((countResult[Choices.even] * 100) / total) : 0,

    [Choices.odd]: (countResult: object, total: number) =>
        100 - (countResult[Choices.even] ? Math.round((countResult[Choices.even] * 100) / total) : 0),
});

const StatisticRuleEntriesFiveElements = Object.entries({
    [Choices.gold]: (countResult: object, total: number) =>
        countResult[Choices.gold] ? Math.round((countResult[Choices.gold] * 100) / total) : 0,
    [Choices.wood]: (countResult: object, total: number) =>
        countResult[Choices.wood] ? Math.round((countResult[Choices.wood] * 100) / total) : 0,
    [Choices.water]: (countResult: object, total: number) =>
        countResult[Choices.water] ? Math.round((countResult[Choices.water] * 100) / total) : 0,
    [Choices.fire]: (countResult: object, total: number) =>
        countResult[Choices.fire] ? Math.round((countResult[Choices.fire] * 100) / total) : 0,
    [Choices.earth]: (countResult: object, total: number) =>
        100 -
        (countResult[Choices.gold] ? Math.round((countResult[Choices.gold] * 100) / total) : 0) -
        (countResult[Choices.wood] ? Math.round((countResult[Choices.wood] * 100) / total) : 0) -
        (countResult[Choices.water] ? Math.round((countResult[Choices.water] * 100) / total) : 0) -
        (countResult[Choices.fire] ? Math.round((countResult[Choices.fire] * 100) / total) : 0),
});

export const StatisticRuleMapping = [StatisticRuleEntriesBigSmall, StatisticRuleEntriesOddEven, StatisticRuleEntriesFiveElements];

export const GetChoiceTranslate = (t: TFunction) => {
    return {
        total: t("total"),
        big: t( "big"),
        small: t( "small"),
        even: t( "even"),
        odd: t("odd"),
        gold: t("gold"),
        wood: t("wood"),
        water: t("water"),
        fire: t("fire"),
        earth: t("earth"),
    };
};

export const ChoiceForTabActive = [
    {
        choice: ["big", "small"],
    },
    {
        choice: ["odd", "even"],
    },
    {
        choice: ["gold", "wood", "water", "fire", "earth"],
    },
];
