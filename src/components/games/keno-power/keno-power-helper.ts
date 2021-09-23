import { TFunction } from "next-i18next";

export const Choices = {
    blue: "blue",
    red: "red",
    big: "big",
    small: "small",
    odd: "odd",
    even: "even",
    blueBig: "blueBig",
    blueSmall: "blueSmall",
    redBig: "redBig",
    redSmall: "redSmall",
};

export const MainChoices = [Choices.blue, Choices.red];

export const SumChoices = [Choices.big, Choices.small, Choices.odd, Choices.even];

export const TeamChoices = [Choices.blueBig, Choices.blueSmall, Choices.redBig, Choices.redSmall];

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
export const StatisticRuleMapping = [StatisticRuleEntriesBigSmall, StatisticRuleEntriesOddEven];

export const GetChoiceTranslate = (t: TFunction, settleResult: any) => {
    return {
        total: t("kenopower:total"),
        big: t(settleResult.big ? "kenopower:big" : "kenopower:small"),
        even: t(settleResult.even ? "kenopower:even" : "kenopower:odd"),
    };
};
