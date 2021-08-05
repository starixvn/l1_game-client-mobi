import { TFunction } from "next-i18next";
import { SettlementResult } from "./keno-pro-max";
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
const ChoicesFiveElement = ["gold", "wood", "water", "fire", "earth"];

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
        100 - (countResult[Choices.odd] ? Math.round((countResult[Choices.odd] * 100) / total) : 0),
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

export const CheckConditionFiveElements = (settlementResult: SettlementResult) => {
    let valueInit = 0;
    ChoicesFiveElement.forEach((choice, index) => {
        if (settlementResult[choice]) {
            valueInit = index;
        }
    });
    return valueInit;
};

export const GetNameFromChoice = (settlementResult: SettlementResult) => {
    let choiceValue = Choices.gold;
    ChoicesFiveElement.forEach((choice) => {
        if (settlementResult[choice]) {
            choiceValue = choice;
        }
    });
    return choiceValue;
};

export const GetChoiceTranslate = (t: TFunction, settleResult: any) => {
    return {
        total: t("kenopromax:total"),
        big: t(settleResult.big ? "kenopromax:big" : "kenopromax:small"),
        even: t(settleResult.even ? "kenopromax:even" : "kenopromax:odd"),
        element: t(`kenopromax:${settleResult.element}`),
    };
};
