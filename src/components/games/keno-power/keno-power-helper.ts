import { TFunction } from "next-i18next";
import { StatisticRuleEntriesEvenOdd, StatisticRuleEntriesBlueRed } from "../../keno/keno.helper";

export const Choices = {
    blue: "blue",
    red: "red",
    tie: "tie",
    big: "big",
    small: "small",
    odd: "odd",
    even: "even",
    blueBig: "blueBig",
    blueSmall: "blueSmall",
    redBig: "redBig",
    redSmall: "redSmall",
};

export interface IChoiceConfig {
    name: string;
    isShowTooltip: boolean;
    tooltipMessage?: string;
}

export const MainChoices: IChoiceConfig[] = [
    {
        name: Choices.blue,
        isShowTooltip: false,
    },
    {
        name: Choices.red,
        isShowTooltip: false,
    },
];

export const SumChoices: IChoiceConfig[] = [
    {
        name: Choices.big,
        isShowTooltip: true,
        tooltipMessage: "[1621~2820]",
    },
    {
        name: Choices.small,
        isShowTooltip: true,
        tooltipMessage: "[420~1620]",
    },
    {
        name: Choices.odd,
        isShowTooltip: false,
    },
    {
        name: Choices.even,
        isShowTooltip: false,
    },
];

export const TeamChoices: IChoiceConfig[] = [
    {
        name: Choices.blueBig,
        isShowTooltip: true,
        tooltipMessage: "[811~1410]",
    },
    {
        name: Choices.blueSmall,
        isShowTooltip: true,
        tooltipMessage: "[210~810]",
    },
    {
        name: Choices.redBig,
        isShowTooltip: true,
        tooltipMessage: "[811~1410]",
    },
    {
        name: Choices.redSmall,
        isShowTooltip: true,
        tooltipMessage: "[210~810]",
    },
];

const StatisticRuleEntriesBigSmall = Object.entries({
    [Choices.big]: (countResult: object, total: number) =>
        countResult[Choices.big] ? Math.round((countResult[Choices.big] * 100) / total) : 0,

    [Choices.small]: (countResult: object, total: number) =>
        100 - (countResult[Choices.big] ? Math.round((countResult[Choices.big] * 100) / total) : 0),
});

const StatisticRuleEntriesBlueBigSmall = Object.entries({
    [Choices.blueBig]: (countResult: object, total: number) =>
        countResult[Choices.blueBig] ? Math.round((countResult[Choices.blueBig] * 100) / total) : 0,

    [Choices.blueSmall]: (countResult: object, total: number) =>
        100 - (countResult[Choices.blueBig] ? Math.round((countResult[Choices.blueBig] * 100) / total) : 0),
});

const StatisticRuleEntriesRedBigSmall = Object.entries({
    [Choices.redBig]: (countResult: object, total: number) =>
        countResult[Choices.redBig] ? Math.round((countResult[Choices.redBig] * 100) / total) : 0,

    [Choices.redSmall]: (countResult: object, total: number) =>
        100 - (countResult[Choices.redBig] ? Math.round((countResult[Choices.redBig] * 100) / total) : 0),
});

export const StatisticRuleMapping = [
    StatisticRuleEntriesBlueRed,
    StatisticRuleEntriesBigSmall,
    StatisticRuleEntriesEvenOdd,
    StatisticRuleEntriesBlueBigSmall,
    StatisticRuleEntriesRedBigSmall,
];

export const GetChoiceTranslate = (t: TFunction, settleResult: any) => {
    return {
        total: t("kenopower:total"),
        big: t(settleResult.big ? "kenopower:big" : "kenopower:small"),
        even: t(settleResult.even ? "kenopower:even" : "kenopower:odd"),
    };
};

export const ChoiceForTabActive = [
    {
        choice: ["red", "blue", "tie"],
    },
    {
        choice: ["big", "small"],
    },
    {
        choice: ["even", "odd"],
    },
    {
        choice: ["blueBig", "blueSmall"],
    },
    {
        choice: ["redBig", "redSmall"],
    },
];
